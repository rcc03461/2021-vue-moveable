import { createStore } from 'vuex'

interface IGolbalStateProps {

}

const store = createStore<IGolbalStateProps>({
    state:{
            count: 0
    },
    mutations: {
        increment(state) {
            state.count++
        }
    }
})


export default store