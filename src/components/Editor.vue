<template>
  <main id="editor-container" class="w-screen h-screen bg-gray-100 pt-20">
    
    <section id="current-page" class="bg-white mx-auto shadow-sm relative" style="width:480px; height:756px;">
      <div 
      v-for="element in pageElements" 
      :key="element.key" 
      :data-uuid="element.key" 
      @pointerdown="setMe(element.key)"
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
        <li class="hover:bg-gray-300">
          <a 
          @click.prevent="removeSelected"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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
          @click.prevent="addText"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </a>
        </li>
        <li class="hover:bg-gray-300 relative">
          <a 
          @click.prevent="addImage"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </a>
        </li>
        <li class="hover:bg-gray-300 relative">
          <a 
          @click.prevent="exportData"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h1v1H5zM3 13a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1H4a1 1 0 01-1-1v-3zm2 2v-1h1v1H5zM13 3a1 1 0 00-1 1v3a1 1 0 001 1h3a1 1 0 001-1V4a1 1 0 00-1-1h-3zm1 2v1h1V5h-1z" clip-rule="evenodd" />
              <path d="M11 4a1 1 0 10-2 0v1a1 1 0 002 0V4zM10 7a1 1 0 011 1v1h2a1 1 0 110 2h-3a1 1 0 01-1-1V8a1 1 0 011-1zM16 9a1 1 0 100 2 1 1 0 000-2zM9 13a1 1 0 011-1h1a1 1 0 110 2v2a1 1 0 11-2 0v-3zM7 11a1 1 0 100-2H4a1 1 0 100 2h3zM17 13a1 1 0 01-1 1h-2a1 1 0 110-2h2a1 1 0 011 1zM16 17a1 1 0 100-2h-3a1 1 0 100 2h3z" />
            </svg>
          </a>
        </li>
        <li class="hover:bg-gray-300 relative">
          <a 
          @click.prevent="exportData"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </a>
        </li>
        <li class="hover:bg-gray-300 relative">
          <a 
          @click.prevent="exportData"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
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
import { ref, reactive, defineComponent , onMounted, nextTick } from 'vue';;
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

    let pageElements = reactive([
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
    target!.style.left = `${left}px`;
    target!.style.top = `${top}px`;
    // console.log("onDrag translate", dist);
    pageElements.find(f=>f.key == target.dataset.uuid).rect = { top, left, width, height }
    // target!.style.transform = transform;


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
    
    const setMe = (key) => {
      // console.log( key, event );
      selectedUUiD.value = key;
      moveable.target = [document.querySelector(`[data-uuid="${key}"]`)];
    };
    
    const removeSelected = () => {
      console.log(pageElements.filter(f=>f.key != selectedUUiD.value));
      
      pageElements = pageElements.filter(f=>f.key != selectedUUiD.value);
      if ( selectedUUiD.value ) {
        moveable.target = null;
      }
    };

    const clearSelect = () => {
      moveable.target = null;
    };

    const togglePosition = () => {
      isPositionOpened.value = !isPositionOpened.value;
    };

    const addText = async () => {
      const key = uuidv4();
      pageElements.push(
      {
        key:key,
        type:'text',
        content:'你好嗎?',
        rect:{
          top:'0',
          left:'0',
          width:'100',
          height:'100',
        }
      });

      await nextTick();
      setMe(key);
      // isPositionOpened.value = !isPositionOpened.value;
    };

    const addImage = async () => {
      const key = uuidv4();
      pageElements.push(
      {
        key:key,
        type:'image',
        content:'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
        rect:{
          top:'200px',
          left:'50px',
          width:'100px',
          height:'100px',
        }
      });

      await nextTick();
      setMe(key);
      // isPositionOpened.value = !isPositionOpened.value;
    };

    const exportData = () => {
      console.log(pageElements);      
      // isPositionOpened.value = !isPositionOpened.value;
    };

    return { 
      selectedUUiD,
      pageElements, 
      isPositionOpened, 
      setMe ,
      clearSelect,
      togglePosition,
      addText,
      addImage,
      removeSelected,
      exportData,
    }

  }
})
</script>

<style scoped>
  
</style>
