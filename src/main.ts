import { createApp, DirectiveBinding } from 'vue'
import { createStore } from 'vuex'

import store  from './store'

import App from './App.vue'

interface IClickOutsideAbleElement extends HTMLElement {
    clickOutsideEvent : ( event :MouseEvent ) => void;
}

const clickOutside = {
    beforeMount: (el: IClickOutsideAbleElement, binding: DirectiveBinding ) => {
        console.log('clickoutside',el, binding);
        
        el.clickOutsideEvent = (event: MouseEvent) => {
            // here I check that click was outside the el and his children
            if (event) {                
                if (!(el == event.target || el.contains(<Node>(event!.target)))) {
                    // and if it did, call method provided in attribute value
                    binding.value();
                }
            }
        };
        document.addEventListener("click", el.clickOutsideEvent);
    },
    unmounted: (el: IClickOutsideAbleElement) => {
        document.removeEventListener("click", el.clickOutsideEvent);
    },
};


createApp(App)
.directive("click-outside", clickOutside)
.use(store)
.mount('#app')
