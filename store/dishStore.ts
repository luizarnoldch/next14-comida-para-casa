import { create } from "zustand"
import { Dish } from "@/types/Types"

const week_days_dishes = [
    "Lomo Saltado",
    "Arroz con Pollo",
    "Pure de papa",
    "Tallarin Rojo",
    "Tallarin Verde",
    "Pure de papa",
    "Chaufa"
]

type State = {
    dishes: string[]
}

type Action = {
    setWeekFoodPlan: () => void
}

const useDishStore = create<State & Action>((set) => ({
    dishes: [],
    setWeekFoodPlan: () => {
        // Clona y reordena aleatoriamente el array week_days_dishes
        const shuffledDishes = [...week_days_dishes].sort(() => 0.5 - Math.random());

        // Actualiza el estado con el nuevo array
        set({ dishes: shuffledDishes });
    }
}));

export default useDishStore;
