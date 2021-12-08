import { getProviders } from "next-auth/react";
import Head from "next/head";
import LoginPage from "../components/Login";

const Login = (providers) => {
  return (
    <>
      <Head>
        <title>Twitter-clone-login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LoginPage providers={providers} />
    </>
  );
};

export async function getServerSideProps() {
  const providers = await getProviders();

  return {
    props: {
      providers,
    },
  };
}

export default Login;
