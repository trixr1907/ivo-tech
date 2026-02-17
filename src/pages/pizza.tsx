import type { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async () => {
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
