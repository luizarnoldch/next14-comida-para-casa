import prisma from "@/lib/prisma";
import { getCommentsByCompanyAndDate } from "@/actions/analytics/get_analytics";
import type { ComentarioMetadata } from "@/types/network";
import NPSHorizontalBarDash from "@/app/dashboard/analytics/_components/Tabs/company_dash/NPSHorizontalBarDash";
import NPSRoundedDash from "@/app/dashboard/analytics/_components/Tabs/company_dash/NPSRoundedDash";
import { Card } from "@/components/ui/card";
import LineDash from "@/components/dashes/LineDash";
import ExternalIframe from "./_components/ExternalIframe";
import IframePage from "./_components/IframePage";

type CompletedSentimentByIdProps = { id_job: string, category_name: string; };

const CompletedSentimentById = async ({
  params,
}: {
  params: Promise<CompletedSentimentByIdProps>;
}) => {
  const { id_job, category_name } = await params;

  // Obtener el nombre de la empresa (name_job) desde search_master
  // const searchMaster = await prisma.search_detail.findFirst({
  //   where: { id_job },
  //   select: { kw_main: true },
  // });
  // const empresa = searchMaster?.kw_main ?? "Unknown Company";

  // // Obtener los comentarios para empresa y rango de fechas fijo
  // const scraperCompanyDataPromise = getCommentsByCompanyAndDate(
  //   empresa,
  //   "2023-01-01",
  //   "2026-01-01"
  // ) as Promise<ComentarioMetadata[]>;

  // const scraperCompanyData = await scraperCompanyDataPromise;

  const register = await prisma.search_master.findUnique({
    where: { id_job: id_job },
  });

  return (
    <div className="flex flex-1 w-full p-2 md:p-4">
      <IframePage id_job={id_job} category={category_name} register={register} />
      {/* <div className="
        grid
        grid-cols-1
        gap-4
        h-auto
        md:grid-cols-2
        lg:grid-cols-[30%_70%]
        w-full
      ">
        <div className="
          grid
          grid-rows-2
          gap-4
          h-auto
          md:grid-rows-2
          md:h-full
        ">
          <Card className="h-auto md:h-full p-4 flex flex-col space-y-2">
            <h3 className="text-lg font-semibold mb-2">Obtained Comments</h3>
            <div className="flex-1 flex flex-col justify-center items-center">
              <span className="text-3xl font-bold">
                {(await scraperCompanyDataPromise).length}
              </span>
            </div>
            <h3 className="font-semibold text-base mt-2">General Emotions</h3>
            <div className="flex-1 flex items-center justify-center">
              <NPSHorizontalBarDash data={scraperCompanyDataPromise} />
            </div>
          </Card>
          <Card className="h-auto md:h-full w-full flex flex-col p-4 justify-center items-center">
            <h3 className="font-semibold text-base mb-2">Buy prediction</h3>
            <div className="w-full h-full flex items-center justify-center">
              <NPSRoundedDash data={scraperCompanyDataPromise} />
            </div>
          </Card>
        </div>
        <div className="
          grid
          grid-rows-2
          gap-4
          h-auto
          md:h-full
        ">
          <Card className="h-auto md:h-full p-4 flex flex-col">
            <h3 className="font-semibold text-base mb-2">Analysis of main topics</h3>
            <div className="
              flex flex-col
              md:flex-row
              h-auto
              md:h-full
              w-full
              items-stretch
              justify-center
              gap-4
            ">
              <div className="md:w-2/5 w-full p-0 md:p-4 flex items-center justify-center">
                <NPSHorizontalBarDash data={scraperCompanyDataPromise} />
              </div>
              <div className="md:w-3/5 w-full p-0 md:p-4">
                <LineDash />
              </div>
            </div>
          </Card>
          <Card className="h-auto md:h-full p-4 flex flex-col">
            <h3 className="font-semibold text-base mb-2">Analysis of main topics</h3>
            <div className="
              w-full
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
              h-auto md:h-full
            ">
              <div className="h-full p-0 md:p-4 flex items-center justify-center">
                <NPSHorizontalBarDash data={scraperCompanyDataPromise} />
              </div>
              <div className="h-full p-0 md:p-4 flex items-center justify-center">
                <NPSHorizontalBarDash data={scraperCompanyDataPromise} />
              </div>
              <div className="h-full p-0 md:p-4 flex items-center justify-center">
                <NPSHorizontalBarDash data={scraperCompanyDataPromise} />
              </div>
            </div>
          </Card>
        </div>
      </div> */}
    </div>
  );
};

export default CompletedSentimentById;