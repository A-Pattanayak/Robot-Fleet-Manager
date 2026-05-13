import {createSlice} from "@reduxjs/toolkit"

const robotSlice=createSlice({

    name:"robots",
    initialState:{
        robots:[],
        filter:"all",
        search: "",
        isLoading: false,
    },
    reducers:{

        setRobot:(state,action)=>{
            state.robots=action.payload
            state.isLoading=false
        },
        setRobotLoading:(state,action)=>{
            state.isLoading=action.payload
        },
        setFilter:(state,action)=>{
            state.filter=action.payload
        },
        setSearch:(state,action)=>{
            state.search=action.payload
        },
        addRobot:(state,action)=>{
            state.robots.unshift(action.payload)
        },
        deleteRobot:(state,action)=>{
            state.robots=state.robots.filter((robot)=>robot.id!==action.payload)
        },
        updateRobotStatus:(state,action)=>{
            const {id,status}=action.payload
            const robot= state.robots.find(r=>r.id===id)
            if(robot){
                robot.status=status
            }
        }

    }
}
)

export const {
  setRobot,
  setRobotLoading,
  setFilter,
  setSearch,
  addRobot,
  deleteRobot,
  updateRobotStatus,
} = robotSlice.actions;
export default robotSlice.reducer;
