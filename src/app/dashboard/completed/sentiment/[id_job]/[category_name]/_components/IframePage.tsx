"use client"

import { search_master } from "@/generated/prisma";
import ExternalIframe from "./ExternalIframe";

type IframePageProps = {
  id_job: string
  category: string
  register: search_master | null
};

export default function IframePage({ id_job, category, register }: IframePageProps) {
  const params = {
    param_id_job: id_job,
    param_id_job_p: id_job,
  };
  const encodedParams = encodeURIComponent(JSON.stringify(params));

  let REPORT_ID: string;
  if (register?.category === "Company") {
    REPORT_ID = "ce960667-78e3-4e46-8e5e-3b0bb888a24a";
  } else if (register?.category === "Political Campaign") {
    REPORT_ID = "0ff1300a-940c-4c75-906b-c33eddf4de8c";
  } else {
    REPORT_ID = "ce960667-78e3-4e46-8e5e-3b0bb888a24a";
  }

  const PAGE_ID = "AloMF";
  const embedUrl = `https://lookerstudio.google.com/embed/reporting/${REPORT_ID}/page/${PAGE_ID}?params=${encodedParams}`;

  return (
    <div style={{ width: '100%', height: '90vh' }}>
      <h3 className="p-4 text-2xl">
        {register?.name_job}
      </h3>
      <ExternalIframe
        src={embedUrl}
        width="100%"
        height="100%"
        title="Looker Studio Dashboard"
        allowFullScreen={true}
      />
    </div>
  );
}
