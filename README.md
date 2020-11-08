
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

  
# Getting Started

First, run the development server:

```bash
npm run dev

# or

yarn dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

# Considerations

  ##### Pros
  * Very quick framework to start on, based on how a normal react app is created (choose this, choose that and then start)
  * Nice SSG, it allows static websites to be extremely fast
  * Allowing SASS and TS without having to put my hands on webpack
  * For now I prefer to stick with the idea that React does work for small-medium size project and not for large ones
  * Don't know how Redux of state management libraries work right now, it doesn't see to fit so much
  ##### Cons
  * Seems kind funky the way the routing works, treating every page literally like a new page, makes the developer have to manually include a header **in every fucking page**, got it the way the framework should work and why it is not like react-router, but it is definetely a drawback
  * Heard about animation issues

## Pages

  

*Static Generation is a great tool to help with SEO issues.*

* Static Generation (Recommended): The HTML is generated at build time and will be reused on each request. To make a page use Static Generation, either export the page component, or export getStaticProps (and getStaticPaths if necessary). It's great for pages that can be pre-rendered ahead of a user's request. You can also use it with Client-side Rendering to bring in additional data.

* Server-side Rendering: The HTML is generated on each request. To make a page use Server-side Rendering, export getServerSideProps. Because Server-side Rendering results in slower performance than Static Generation, use this only if absolutely necessary.

  
  

## Data Fetching

  

We already viewed three forms of fetching data for pre-rendering:

  

* getStaticProps (Static Generation): Fetch data at build time.

* getStaticPaths (Static Generation): Specify dynamic routes to pre-render based on data.

* getServerSideProps (Server-side Rendering): Fetch data on each request.

  

### getStaticProps

* *Will be used for pre-rendering pages in build time.*
*  *This feature allow the client to be served like a regular rails or django static page, just getting data straight from the database: the static data will be maintained and the database queries erased (check security issues)* 

**NICE**: You can import modules in top-level scope for use in getStaticProps. Imports used in getStaticProps will not be bundled for the client-side. This means you can write server-side code directly in getStaticProps. This includes reading from the filesystem or a database.

  

Example:

  

```jsx
// posts will be populated at build time by getStaticProps()
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It won't be called on client-side, so you can even do
// direct database queries. See the "Technical details" section.
export async function getStaticProps() {
  // Call an external API endpoint to get posts.
  // You can use any data fetching library
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: posts }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}

export default Blog
```

When to use `getStaticProps`:

-   The data required to render the page is available at build time ahead of a user’s request.
-   The data comes from a headless CMS.
-   The data can be publicly cached (not user-specific).
-   The page must be pre-rendered (for SEO) and be very fast —  `getStaticProps`  generates HTML and JSON files, both of which can be cached by a CDN for performance.

#### Incremental Static Regeneration

*A way to always generate the new content, by not having to redeploy (what I understood is that you can hook the static content generation to a request, so get the newest info and then update the static content)*

 With  [`getStaticProps`](https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation)  you don't have to stop relying on dynamic content, as  **static content can also be dynamic**. Incremental Static Regeneration allows you to update  _existing_  pages by re-rendering them in the background as traffic comes in.

Inspired by  [stale-while-revalidate](https://tools.ietf.org/html/rfc5861), background regeneration ensures traffic is served uninterruptedly, always from static storage, and the newly built page is pushed only after it's done generating.

Consider our previous  [`getStaticProps`  example](https://nextjs.org/docs/basic-features/data-fetching#simple-example), but now with regeneration enabled:

```jsx
function Blog({ posts }) {
  return (
    <ul>
      {posts.map((post) => (
        <li>{post.title}</li>
      ))}
    </ul>
  )
}

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 1, // In seconds
  }
}

export default Blog
```
Now the list of blog posts will be revalidated once per second; if you add a new blog post it will be available almost immediately, without having to re-build your app or make a new deployment.

#### Write server-side code directly
*Nice feature to completly elimanates the usage of a backend server (but check security issues)* 

Note that  `getStaticProps`  runs only on the server-side. It will never be run on the client-side. It won’t even be included in the JS bundle for the browser. That means you can write code such as direct database queries without them being sent to browsers. You should not fetch an  **API route**  from  `getStaticProps`  — instead, you can write the server-side code directly in  `getStaticProps`.

You can use  [this tool](https://next-code-elimination.now.sh/)  to verify what Next.js eliminates from the client-side bundle.

#### Statically Generates both HTML and JSON

*Important to note that the static data turns into a JSON file and getStaticProps will never be called*

When a page with  `getStaticProps`  is pre-rendered at build time, in addition to the page HTML file, Next.js generates a JSON file holding the result of running  `getStaticProps`.

This JSON file will be used in client-side routing through  `next/link`  ([documentation](https://nextjs.org/docs/api-reference/next/link)) or  `next/router`  ([documentation](https://nextjs.org/docs/api-reference/next/router)). When you navigate to a page that’s pre-rendered using  `getStaticProps`, Next.js fetches this JSON file (pre-computed at build time) and uses it as the props for the page component. This means that client-side page transitions will  **not**  call  `getStaticProps`  as only the exported JSON is used.


### getStaticPaths
*Used with getStaticProps to generate the static pages*

If a page has dynamic routes ([documentation](https://nextjs.org/docs/routing/dynamic-routes)) and uses `getStaticProps` it needs to define a list of paths that have to be rendered to HTML at build time.

The getStaticPaths must have two keys inside: **paths** and **fallback**

##### Paths
Determine which paths will be pre-rendered. For example, suppose that you have a page that uses dynamic routes named `pages/posts/[id].js`. If you export `getStaticPaths` from this page and return the following for `paths`:
```js
return {
  paths: [
    { params: { id: '1' } },
    { params: { id: '2' } }
  ],
  fallback: ...
}
```
Then Next.js will statically generate  `posts/1`  and  `posts/2`  at build time using the page component in  `pages/posts/[id].js`.

##### Fallback
If `fallback` is `false`, then any paths not returned by `getStaticPaths` will result in a **404 page**.
If `fallback` is `true` then if the path is not inside the JSON generated it will load a fallback page (like loading), then next will generate the static content, add to the JSON and serve it (will be forever in the static generated "cache").

*Fallback true is very useful when you have a very large number of static pages that depend on that (large e-commerce), the pre-render would take forever, so you select a small subset of pages, build them and when a client access a page not loaded, it will be generated and then available to other clients*


### getServerSideProps
*Next pre-render that pages at every request, so it is useful only for pages that cannot be cached by a CDN (search for an example, not fitting that much right now, because if the data is from the user I could use a generic fetch. What can be pre-rendered? Maybe a good way to use in some parts of the page like a white label site)*
**NICE**: You can import modules in top-level scope for use in  `getServerSideProps`. Imports used in  `getServerSideProps`  will not be bundled for the client-side. This means you can write  **server-side code directly in  `getServerSideProps`**. This includes reading from the filesystem or a database.

  

### Fetching data on the client side

*Normal react stuff for highly user dependent pages, like profile, dashboard, etc*

The team behind Next.js has created a React hook for data fetching called  

##### SWR
*Definely use it*

We highly recommend it if you’re fetching data on the client side. It handles caching, revalidation, focus tracking, refetching on interval, and more. And you can use it like so:

```jsx
import useSWR from 'swr'

function Profile() {
  const { data, error } = useSWR('/api/user', fetch)

  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>
  return <div>hello {data.name}!</div>
}
```

## Built-In CSS Support
*That seems like some good stuff,  good ol' react had some problems with declaring variables in JS and SCSS, for example defaultFontSize had to be declared in CSS and if used for styling React, inside JS*

Next.js allows you to import CSS files from a JavaScript file. This is possible because Next.js extends the concept of [`import`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import) beyond JavaScript.

`styles.css` (imported inside _app.js) will apply to all pages and components in your application. Due to the global nature of stylesheets, and to avoid conflicts, you may **only import them inside  [`pages/_app.js`](https://nextjs.org/docs/advanced-features/custom-app)**.

### Adding Component-Level CSS

Next.js supports  [CSS Modules](https://github.com/css-modules/css-modules)  using the  `[name].module.css`  file naming convention.

### Sass Support

Next.js allows you to import Sass using both the  `.scss`  and  `.sass`  extensions. You can use component-level Sass via CSS Modules and the  `.module.scss`  or  `.module.sass`  extension.

## Image Optimization

*Use it for image optimation for different devices* 

### Image Component

To add an image to your application, import the  [`next/image`](https://nextjs.org/docs/api-reference/next/image)  component:

```jsx
import Image from 'next/image'

function Home() {
  return (
    <>
      <h1>My Homepage</h1>
      <Image
        src="/me.png"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <p>Welcome to my homepage!</p>
    </>
  )
}

export default Home
```

### Configuration
*See later what it helps for each device*

In addition to  [using properties](https://nextjs.org/docs/api-reference/next/image)  available to the  `next/image`  component, you can optionally configure Image Optimization for more advanced use cases via  `next.config.js`.

If no configuration is provided, the following default configuration will be used.

```js
module.exports = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: [],
    path: '/_next/image',
    loader: 'default',
  },
}
```