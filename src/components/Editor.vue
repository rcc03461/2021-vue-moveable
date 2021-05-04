<template>
  <main id="editor-container" class="w-screen h-screen bg-gray-100 pt-20">
    
    <section id="current-page" class="bg-white mx-auto shadow-sm relative" style="width:480px; height:756px;">
      <div 
      v-for="element in pageElements" 
      :key="element.key" 
      :data-uuid="element.key" 
      @pointerdown="setMe($event, element.key)"
      class="absolute"  
      :style="element.rect"
      >
        <img v-if="element.type == 'image'" :src="element.content" class="w-full h-full object-contain">
        <span v-if="element.type == 'text'" >{{element.content}}</span>
      </div>
      <!-- <div  class="absolute" @pointerdown="setMe($event, '1231')">OMG</div> -->
    </section>

    <section id="menubar"></section>
    <section id="infobar"></section>
    <section id="infobar" class="fixed top-48 right-5 flex-col bg-gray-200">
      <ul>
			  <!-- Items Section -->
        <li class="hover:bg-gray-300">
          <a 
          @click.prevent="clearSelect"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </a>
        </li>
        <li class="hover:bg-gray-300 relative">
          <a 
          @click.prevent="togglePosition"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </a>
          <div v-if="isPositionOpened" class="w-96 bg-gray-200 absolute right-0 top-0 mr-12">
            <div class="grid grid-cols-2 gap-5 p-5">
              <div class="flex">
                <div class="w-16">x</div>
                <div class="flex-1"><input class="w-full bg-transparent" type="text" :value="pageElements.find(f=>f.key == selectedUUiD).rect.left"></div>
              </div>
              <div class="flex">
                <span class="w-16">y</span>
                <div class="flex-1"><input class="w-full bg-transparent" type="text" :value="pageElements.find(f=>f.key == selectedUUiD).rect.top"></div>
              </div>
              <div class="flex">
                <span class="w-16">Width</span>
                <div class="flex-1"><input class="w-full bg-transparent" type="text" :value="pageElements.find(f=>f.key == selectedUUiD).rect.width"></div>
              </div>
              <div class="flex">
                <span class="w-16">Height</span>
                <div class="flex-1"><input class="w-full bg-transparent" type="text" :value="pageElements.find(f=>f.key == selectedUUiD).rect.height"></div>
              </div>
            </div>
          </div>
        </li>
        <li class="hover:bg-gray-300 relative">
          <a 
          @click.prevent="addImage"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </a>
        </li>
      </ul>
      
      <!-- <a href="#" @click="clearSelect">C</a>
      <div>
        {{selectedUUiD}}
      </div> -->
    </section>
  </main>
</template>

<script lang="ts">
import { ref, reactive, defineComponent , onMounted} from 'vue';;
import Moveable from "moveable";
import { v4 as uuidv4 } from 'uuid';

export default defineComponent({
  name: 'Editor',
  // props: {
  //   msg: {
  //     type: String,
  //     required: true
  //   }
  // },
  setup: () => {

    const selectedUUiD = ref(null);
    const isPositionOpened = ref(false);

    const pageElements = reactive([
      {
        key:uuidv4(),
        type:'text',
        content:'你好嗎?',
        rect:{
          top:'50px',
          left:'50px',
          width:'100px',
          height:'100px',
        }
      },
      {
        key:uuidv4(),
        type:'image',
        content:'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
        rect:{
          top:'300px',
          left:'50px',
          width:'100px',
          height:'100px',
        }
      }
    ]);

    const moveable = new Moveable(document.body, {
        target: null,
        // If the container is null, the position is fixed. (default: parentElement(document.body))
        container: document.querySelector('#current-page'),
        draggable: true,
        resizable: true,
        scalable: false,
        rotatable: true,
        warpable: false,
        // Enabling pinchable lets you use events that
        // can be used in draggable, resizable, scalable, and rotateable.
        pinchable: true, // ["resizable", "scalable", "rotatable"]
        origin: false,
        keepRatio: false,
        // Resize, Scale Events at edges.
        edge: false,
        throttleDrag: 0,
        throttleResize: 0,
        throttleScale: 0,
        throttleRotate: 0,
    });

/* draggable */
moveable.on("dragStart", ({ target, clientX, clientY }) => {
    // console.log("onDragStart", target);
}).on("drag", ({
    target, transform,
    left, top, right, bottom,
    width, height,
    beforeDelta, beforeDist, delta, dist,
    clientX, clientY,
}) => {
    // console.log("onDrag left, top", left, top, width, height);
    // target!.style.left = `${left}px`;
    // target!.style.top = `${top}px`;
    // console.log("onDrag translate", dist);
    pageElements.find(f=>f.key == target.dataset.uuid).rect = { top, left, width, height }
    target!.style.transform = transform;


}).on("dragEnd", ({ target, isDrag, clientX, clientY }) => {
    // console.log("onDragEnd", target, isDrag);    
});

/* resizable */
moveable.on("resizeStart", ({ target, clientX, clientY }) => {
    // console.log("onResizeStart", target);
}).on("resize", ({ target, width, height, dist, delta, clientX, clientY }) => {
    // console.log("onResize", target);
    delta[0] && (target!.style.width = `${width}px`);
    delta[1] && (target!.style.height = `${height}px`);
    pageElements.find(f=>f.key == target.dataset.uuid).rect.width = width;
    pageElements.find(f=>f.key == target.dataset.uuid).rect.height = height;

}).on("resizeEnd", ({ target, isDrag, clientX, clientY }) => {
    // console.log("onResizeEnd", target, isDrag);
});

/* scalable */
// moveable.on("scaleStart", ({ target, clientX, clientY }) => {
//     console.log("onScaleStart", target);
// }).on("scale", ({
//     target, scale, dist, delta, transform, clientX, clientY, width, height
// }: OnScale) => {
//     console.log("onScale scale", scale, width, height);
//     target!.style.transform = transform;

// }).on("scaleEnd", (els) => {
//   // { target, isDrag, clientX, clientY }
//     console.log("onScaleEnd", els);
// });

/* rotatable */
// moveable.on("rotateStart", ({ target, clientX, clientY }) => {
//     console.log("onRotateStart", target);
// }).on("rotate", ({ target, beforeDelta, delta, dist, transform, clientX, clientY }) => {
//     console.log("onRotate", dist);
//     target!.style.transform = transform;
// }).on("rotateEnd", ({ target, isDrag, clientX, clientY }) => {
//     console.log("onRotateEnd", target, isDrag);
// });


/* pinchable */
// Enabling pinchable lets you use events that
// can be used in draggable, resizable, scalable, and rotateable.
// moveable.on("pinchStart", ({ target, clientX, clientY }) => {
//     // pinchStart event occur before dragStart, rotateStart, scaleStart, resizeStart
//     console.log("onPinchStart");
// }).on("pinch", ({ target, clientX, clientY, datas }) => {
//     // pinch event occur before drag, rotate, scale, resize
//     console.log("onPinch");
// }).on("pinchEnd", ({ isDrag, target, clientX, clientY, datas }) => {
//     // pinchEnd event occur before dragEnd, rotateEnd, scaleEnd, resizeEnd
//     console.log("onPinchEnd");
// });

onMounted(()=>{
  window.onresize = function(){
    moveable.updateRect();
  }
})
    
    const setMe = (event , key) => {
      console.log( key, event );
      selectedUUiD.value = key;
      moveable.target = [document.querySelector(`[data-uuid="${key}"]`)];
    };
    
    const clearSelect = () => {
      moveable.target = null;
    };

    const togglePosition = () => {
      isPositionOpened.value = !isPositionOpened.value;
    };

    const addImage = () => {
      // isPositionOpened.value = !isPositionOpened.value;
    };

    return { 
      selectedUUiD,
      pageElements, 
      isPositionOpened, 
      setMe ,
      clearSelect,
      togglePosition,
      addImage
    }

  }
})
</script>

<style scoped>
  
</style>
