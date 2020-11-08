import posts from '../../posts.json'

const Post = (props) => {
  return (
    <>
      <h1>{props.post.title}</h1>
      <p>{props.post.content}</p>
    </>
  )
}


Post.getInitialProps = ({ query }) => {
  return {
    post: posts[query.id]
  }
}

export default Post;