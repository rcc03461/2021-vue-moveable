<template>
  <main id="editor-container" class="w-screen h-screen bg-gray-100 pt-20">
    <section class="h-full w-full" @click.passive.capture="clearSelect">
      <div id="current-page" class="bg-white mx-auto shadow-sm relative" style="width:480px; height:756px;">
        <div id="current-page-content" class="w-full h-full">
          <div 
          v-for="element in pageElements" 
          :key="element.key" 
          :data-uuid="element.key" 
          @pointerdown="setMe(element.key)"
          class="editable-element absolute"  
          :style="element.rect"
          >
            <img v-if="element.type == 'image'" :src="element.content" class="w-full h-full object-contain">
            <div v-if="element.type == 'text'" @dblclick="textDbclick" class="table w-full h-full">
              <div class="table-cell">{{element.content}}</div>
            </div>
          </div>
        </div>
        <!-- <div  class="absolute" @pointerdown="setMe($event, '1231')">OMG</div> -->
      </div>
    </section>

    <section id="menubar"></section>
    <section id="navbar" class="fixed top-0 left-0 flex-col bg-gray-200 h-full overflow-y-auto">
      <div @click.prevent="addPage" class="flex py-3 border-b-2 border-black justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div v-for="(page, index) in pages" :key="page.key" class="mx-5 my-3 border-blue-500" :class="{'border-l-2':currentPageIndex == index}" >
          <img :src="page.info.cover" alt="" class="w-32 hover:shadow-lg cursor-pointer"  @click.prevent="selectPage(index)">
      </div>
    </section>
    <section id="editbar" class="fixed w-72 top-0 right-0 h-screen shadow-xs bg-gray-200">
      
    </section>
    <section id="infobar" class="fixed top-0 right-72 flex-col bg-gray-200  shadow-xs">
      <ul>
			  <!-- Items Section -->
        <li class="hover:bg-gray-300" title="Clear Selected">
          <a 
          @click.prevent="clearSelect"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </a>
        </li>
        <li class="hover:bg-gray-300" title="Remove Selected">
          <a 
          @click.prevent="removeSelected"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </a>
        </li>
        <li class="hover:bg-gray-300 relative" title="Info - Position">
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
        <li class="hover:bg-gray-300 relative" title="Add Text">
          <a 
          @click.prevent="addText"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </a>
        </li>
        <!-- <li class="hover:bg-gray-300 relative"  title="Add Image">
          <a 
          @click.prevent="addImage"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </a>
        </li> -->
        <li class="hover:bg-gray-300 relative"  title="Info - Layers"   v-click-outside="closeLayers">

          <a 
          @click.prevent="openLayers"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </a>
          <div v-if="isLayersOpened" class="w-40 bg-gray-200 absolute right-0 top-0 mr-12" >
            <ul class="">
              <li 
              v-for="element in pageElements" 
              :key="element.key" 
              :data-uuid="element.key" 
              @pointerdown="setMe(element.key)"
              class="flex px-2 py-2 hover:bg-gray-300 border-blue-500" 
              :class="{
                'border-l-2': element.key == selectedUUiD
              }"
              >
                <div class="w-8 ">
                  <svg v-if="element.type == 'image'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <svg v-if="element.type == 'text'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <div class="flex-1">{{element.type == 'text' ? element.content.substring(0, 5): element.type}}</div>
              </li>
            </ul>
          </div>
        </li>
        <li class="hover:bg-gray-300">
          <a 
          @click.prevent="toggleAnimations"
          href="#" 
          class="h-12 px-3 flex justify-center items-center w-full focus:text-orange-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </a>

          <div v-if="isAnimationsOpened" class="w-48 bg-gray-200 absolute right-0 top-0 mr-12 p-3">
            <h3>Animations :</h3>
            <div v-for="(ani,index) in pageElements.find(f=>f.key == selectedUUiD).animations" :key="ani.key">
              <select name="anmation" id="" v-model="ani.anmation">
                <option value="">Select</option>
                <option value="fadeIn">fadeIn</option>
                <option value="fadeInLeft">fadeInLeft</option>
                <option value="fadeInRight">fadeInRight</option>
              </select>
              <div class="flex">
                <div class="w-20">Duration:</div>
                <div class="flex-1"><input class="w-full bg-transparent" type="number"  step="100" v-model.number="ani.duration"></div>
              </div>
              <div class="flex">
                <div class="w-20">Delay:</div>
                <div class="flex-1"><input class="w-full bg-transparent" type="number"  step="100" v-model.number="ani.delay"></div>
              </div>
            </div>

          </div>
      
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
import { ref, reactive, defineComponent , onMounted, nextTick } from 'vue';
import { useStore } from 'vuex'
import Moveable from "moveable";
import { v4 as uuidv4 } from 'uuid';
import domtoimage from 'dom-to-image';
import draggable from 'vuedraggable';

export default defineComponent({
  name: 'Editor',
  // props: {
  //   msg: {
  //     type: String,
  //     required: true
  //   }
  // },

  components: {
      draggable,
  },
  setup: () => {


    const store = useStore();


    const pages = ref(null);

    const selectedUUiD = ref(null);
    const isPositionOpened = ref(false);
    const isLayersOpened = ref(false);
    const isAnimationsOpened = ref(false);

    let currentPageIndex = ref(0);
    let pageInfo = ref({});
    let pageElements = ref([]);

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
    pageElements.value.find(f=>f.key == target.dataset.uuid)!.rect = { 
      top: top + 'px' , 
      left: left + 'px' , 
      width: width + 'px' , 
      height: height + 'px'  
    }
    // target!.style.transform = transform;


}).on("dragEnd", ({ target, isDrag, clientX, clientY }) => {
    // console.log("onDragEnd", target, isDrag);    
    updatePage();
});

/* resizable */
moveable.on("resizeStart", ({ target, clientX, clientY }) => {
    // console.log("onResizeStart", target);
}).on("resize", ({ target, width, height, dist, delta, clientX, clientY }) => {
    // console.log("onResize", target);
    delta[0] && (target!.style.width = `${width}px`);
    delta[1] && (target!.style.height = `${height}px`);
    pageElements.value.find(f=>f.key == target.dataset.uuid)!.rect.width = width + 'px';
    pageElements.value.find(f=>f.key == target.dataset.uuid)!.rect.height = height + 'px';

}).on("resizeEnd", ({ target, isDrag, clientX, clientY }) => {
    // console.log("onResizeEnd", target, isDrag);
    updatePage();
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


    
    const setMe = (key) => {
      // console.log( key, event );
      selectedUUiD.value = key;
      moveable.target = [document.querySelector(`[data-uuid="${key}"]`)];
    };
    
    const removeSelected = async () => {
      
      if ( selectedUUiD.value ) {
        moveable.target = null;
        await nextTick();
        // pageElements = {...pageElements.filter(f=>f.key != selectedUUiD.value)};
        const removeIndex = pageElements.value.findIndex(f=>f.key == selectedUUiD.value);
        console.log(removeIndex);
        pageElements.value.splice(removeIndex, 1);
      }

      updatePage();

    };

    const clearSelect = ($event) => {
      if (!$event) {
        moveable.target = null;
        return;
      }
      let isContain = ![...document.querySelectorAll('.editable-element')].some(s=>s.contains($event.target));
      if (isContain) {
        moveable.target = null;
      }
    };

    const togglePosition = () => {
      isPositionOpened.value = !isPositionOpened.value;
    };

    const toggleLayers = () => {
      isLayersOpened.value = !isLayersOpened.value;
    };
    const openLayers = () => {
      isLayersOpened.value = true;
    };
    const closeLayers = () => {
      isLayersOpened.value = false;
    };

    const toggleAnimations = () => {
      isAnimationsOpened.value = !isAnimationsOpened.value;
    };

    const addPage = async () => {
      const key = uuidv4();
      pages.value.push({
        info: {
          key:uuidv4(),
          cover:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAL0AeADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ALMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/2Q==",
          title:''
        },
        elements:[]        
      });
      
      await nextTick();
      setMe(key);

    };
    const addText = async () => {
      const key = uuidv4();
      pageElements.value.push(
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

    const addImage = async (url = null) => {
      const key = uuidv4();
      pageElements.value.push(
      {
        key:key,
        type:'image',
        content: url || 'https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png',
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
      console.log(pageElements.value);      
      // isPositionOpened.value = !isPositionOpened.value;
      // domtoimage.toPng(document.getElementById('current-page'))
      //   .then(function (dataUrl) {
      //       var img = new Image();
      //       img.src = dataUrl;
      //       document.body.appendChild(img);
      //   })
      //   .catch(function (error) {
      //       console.error('oops, something went wrong!', error);
      //   });

    };



onMounted(()=>{
  window.onresize = function(){
    moveable.updateRect();
  }

  document.body.addEventListener("dragover", function(e){
    e = e || event;
    e.preventDefault();
    console.log("over true");
  }, true);

  document.body.addEventListener("drop",function(e){
    e = e || event;
    e.preventDefault();
    console.log("Drop true");

    // begin loading image data to pass to our embed
    var droppedFiles = e.dataTransfer.files;
    var fileReaders = {};
    var files = {};
    var reader;

    for (var i = 0; i < droppedFiles.length; i++) {
      files[i] = droppedFiles[i]; // bc file is ref is overwritten
      console.log("File: " + files[i].name + " " + files[i].size);
      reader = new FileReader();
      reader.file = files[i]; // bc loadend event has no file ref

      reader.addEventListener("loadend", function (ev, loadedFile) {
        var fileObject = {};
        var currentReader = ev.target;

        loadedFile = currentReader.file;
        console.log("File loaded:" + loadedFile.name);
        fileObject.dataURI = currentReader.result;
        fileObject.name = loadedFile.name;
        fileObject.type = loadedFile.type;
        // call function on embed and pass file object
        console.log(fileObject);
        addImage(currentReader.result)
      });

      reader.readAsDataURL(files[i]);
      
    }

  }, true);

  pages.value = [
      {
        key:uuidv4(),
        info: {
          key:uuidv4(),
          cover:"data:image/jpeg;base64,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",
          title:'hi'
        },
        elements:[
          {
            key:uuidv4(),
            type:'text',
            content:'你好嗎?',
            rect:{
              top:'50px',
              left:'50px',
              width:'100px',
              height:'100px',
            },
            animations:[
              {
                key:uuidv4(),
                anmation:'fadeIn',
                duration:1000,
                delay:0
              }
            ]
          },
          {
            key:uuidv4(),
            type:'image',
            content:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAAjCAYAAAA9riDJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDYuMC1jMDA2IDc5LjE2NDc1MywgMjAyMS8wMi8xNS0xMTo1MjoxMyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzZDODU2RDhBMDJEMTFFQkEzMTdDMzQzMjY1MkY1MjAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzZDODU2RDdBMDJEMTFFQkEzMTdDMzQzMjY1MkY1MjAiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjBBMUMyMzU0Q0YxMUU3QkVDMUVERkJBMEQzRDQ1QSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjBBMUMyNDU0Q0YxMUU3QkVDMUVERkJBMEQzRDQ1QSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PljaYWoAABcSSURBVHja7FwJkBRl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",
            rect:{
              top:'300px',
              left:'50px',
              width:'100px',
              height:'100px',
            },
            animations:[]
          }
        ]
      }
    ];

  // currentPageIndex = 0;
  selectPage(currentPageIndex.value); // currentPageIndex ( default = 0 )

});

const updatePage = () => {
    domtoimage.toJpeg(document.getElementById('current-page-content'), { bgcolor:'white', quality: 0.7 })
    .then(function (dataUrl) {
        pages.value[currentPageIndex.value].info.cover = dataUrl;
    });
    // pages.value[currentPageIndex.value].info = 
    pages.value[currentPageIndex.value].elements = pageElements.value;
}

const selectPage = (index) => {
  currentPageIndex.value = index;
  pageInfo.value = pages.value[index].info;
  pageElements.value = pages.value[index].elements;
  clearSelect();
}

const textDbclick = (event) => {
  alert(1);
}


    return { 
      pages,
      currentPageIndex,
      selectedUUiD,
      pageInfo,
      pageElements, 
      isPositionOpened, 
      isLayersOpened, 
      isAnimationsOpened, 
      setMe ,
      addPage,
      selectPage,
      clearSelect,
      togglePosition,
      toggleLayers,
      toggleAnimations,
      addText,
      addImage,
      removeSelected,
      exportData,

openLayers,
closeLayers,

      textDbclick
    }

  }
})
</script>

<style scoped>
  
</style>
