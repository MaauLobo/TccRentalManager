<template>
    <div class="modal" v-if="isOpen">
      <div class="modal-content">
        <span class="close" @click="fecharModal">&times;</span>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isOpen: false,
      };
    },
    methods: {
      fecharModal() {
        this.isOpen = false;
      },
    },
  };
  </script>
  
  <style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  
}

.modal-content {
  background: linear-gradient(#141e30, #243b55);
  border: #141e30 5px solid;
  padding: 20px;
  border-radius: 5px;
  max-width: 400px;
  text-align: center;
  color: #fff;
  position: relative; /* Adicionado /
}

.close {
  color: #aaa;
  font-size: 28px;
  font-weight: bold;
  cursor: pointer;
  position: absolute; / Adicionado /
  top: 10px; / Adicionado /
  right: 10px; / Adicionado */
}

.close:hover {
  color: #7e2d2d;
}


  </style>
  

  