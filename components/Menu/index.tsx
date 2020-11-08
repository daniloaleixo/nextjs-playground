import Link from 'next/link';

const Menu = () => {
  return (
    <nav>
      <Link href="/">
        <a>Home</a>
      </Link>
      &nbsp;
      <Link href="/about">
        <a>About</a>
      </Link>
    </nav>
  );
};

export default Menu;