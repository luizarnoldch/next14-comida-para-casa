"use client"

import WeekBlock from "./WeekBlock"
import useDishStore from "@/store/dishStore"

const week_days = [
    "Lunes",
    "Martes",
    "Miercoes",
    "Jueves",
    "Vierens",
    "Sábado",
    "Domingo"
]


const WeekCalendar = () => {

    const week_days_dishes = useDishStore((state) => state.dishes)

  return (
    <div className='grid grid-cols-7 grid-rows-2 gap-2 items-center'>
        {
            week_days.map((item,index) => (
                <WeekBlock key={index}>
                    {item}
                </WeekBlock>
            ))
        }
        {
            week_days_dishes.map((item,index) => (
                <WeekBlock key={index} className="h-16 flex items-center justify-center">
                    {item}
                </WeekBlock>
            ))
        }
    </div>
  )
}

export default WeekCalendar