import Head from "next/head";
import Feed from "../components/Feed";
import Sidebar from "../components/Sidebar";

import { getSession } from "next-auth/react";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRecoilState } from "recoil";
import { loaderStatus } from "../atoms/loaderStatus";
import Widgets from "../components/Widgets";

export default function Home({ trendingResults, followResults }) {
  const [loading, setLoading] = useRecoilState(loaderStatus);

  return (
    <div className=" ">
      <Head>
        <title>Twitter - clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-[#1d1d1d] min-h-screen flex max-w-[1500px] mx-auto">
        {loading && <LoadingSpinner />}
        <Sidebar />
        <Feed />
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />
      </main>
    </div>
  );
}

export async function getServerSideProps(context) {
  const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then(
    (res) => res.json()
  );
  const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then(
    (res) => res.json()
  );

  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      trendingResults,
      followResults,
      session,
    },
  };
}
