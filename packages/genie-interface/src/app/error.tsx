"use client";

import NotFoundCommon from "@components/common/not-found-common";
import { NextPage } from "next";

interface PropsType {
  error: Error & { digest?: string };
  reset: () => void;
}

const Error: NextPage<PropsType> = ({ error, reset }) => {
  return (
    <NotFoundCommon
      title="Something went wrong!"
      subText="There seems to be a problem with this page."
      callback={() => {
        () => reset();
      }}
    />
  );
};

export default Error;
