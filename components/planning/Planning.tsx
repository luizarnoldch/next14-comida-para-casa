"use client"

import useDishStore from "@/store/dishStore"
import Button from "@/components/button/Button";
type Props = {}

const Planning = (props: Props) => {


    const setWeekFoodPlan = useDishStore((state) => state.setWeekFoodPlan)
  return (
    <div className="mx-auto w-96 flex flex-col justify-center items-center gap-4 py-8">
          <h1>Genera tus platos de la semana</h1>
          <Button onClick={setWeekFoodPlan}>
            <p>Generar ya!</p>
          </Button>
        </div>
  )
}

export default Planning