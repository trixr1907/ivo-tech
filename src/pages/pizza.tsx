import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('X-Robots-Tag', 'noindex, follow');

  return {
    redirect: {
      destination: '/pizza/index.html',
      permanent: false
    }
  };
};

export default function PizzaRedirectPage() {
  return null;
}
