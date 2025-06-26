<script setup lang="ts">
import {ref, watch} from 'vue'
import {searchUsers} from "@/js/User.ts";
import {getSpecificContact} from "@/js/chat.ts";

const showDropdown = ref(false)
const searchQuery = ref('')
const searchResults = ref([])
const contactPersonList = defineModel('contactPersonList')
const activeContact=defineModel('activeContact')
watch(searchQuery, async (newQuery: string) => {
  if (newQuery.trim() === '') {
    showDropdown.value = false
  } else {
    const params = {
      keyword: newQuery,
    }
    searchResults.value = (await searchUsers(params)).data.content
    showDropdown.value = true
  }
})

const addUser = async (contactId: number) => {
  let flag=false
  let personIndex=0
  for (let i = 0; i < contactPersonList.value.length; i++) {
    if (contactPersonList.value[i].chatWithUserId	 === contactId) {
      flag = true
      personIndex = i
      break
    }
  }
  if(flag){
    activeContact.value = contactPersonList.value[personIndex]
  }
  else{
    const newContact = await getSpecificContact(contactId)
    contactPersonList.value.unshift(await getSpecificContact(contactId))
    console.log(newContact)
    activeContact.value = newContact
    console.log(contactPersonList.value)
  }
}
</script>

<template>
  <div class="dropdown dropdown-bottom">
    <input type="text" class="search-input" placeholder="搜索联系人" v-model="searchQuery">

    <ul
      tabindex="0"
      class="dropdown-content menu bg-base-100 rounded-box z-1 w-[230px] p-2 shadow-sm border"
      v-if="showDropdown"
    >
      <li v-for="(searchResult, index) in searchResults" :key="index" @click="addUser(searchResult.id)"><a>{{searchResult.username}}</a></li>
    </ul>
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to right, #5c5c5c, #f5f5f5);
  padding: 30px;
  border-radius: 15px;
  transition: background 0.3s ease;
  perspective: 1000px;
}

.label {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
  transition: transform 0.3s ease, font-size 0.3s ease, color 0.3s ease,
  text-shadow 0.3s ease;
}

.search-input {
  position: relative;
  width: 230px;
  height: 40px;
  padding: 12px;
  border: 2px solid #ccc;
  border-radius: 8px;
  background: linear-gradient(to right, #d9d9d9, #f8f8f8);
  font-size: 16px;
  color: #555;
  outline: none;
  transition: box-shadow 0.3s ease, background 0.3s ease, color 0.3s ease,
  border-color 0.3s ease, transform 0.3s ease;
  transform-style: preserve-3d;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1), 0 0 5px rgba(0, 0, 0, 0.2) inset; /* Improved box-shadow for a realistic feel */
}

.search-input:focus,
.search-input:not(:placeholder-shown) {
  border-color: #4caf50;
  background: linear-gradient(to right, #c2f0c2, #f0f0f0);
  transform: rotateX(20deg);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.2) inset; /* Improved box-shadow on focus */
}

.search-input:focus + .label,
.search-input:not(:placeholder-shown) + .label {
  transform: translateY(-120%) scale(0.8);
  font-size: 12px;
  color: #4caf50;
  text-shadow: 0 0 5px rgba(76, 175, 80, 0.6);
}

.search-input:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1), 0 0 10px rgba(0, 0, 0, 0.2) inset; /* Improved box-shadow on hover */
  background: linear-gradient(to right, #e6e6e6, #f9f9f9);
  border-color: #999;
}

.clear-button {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease, color 0.3s ease;
}

.clear-button:hover {
  color: #4caf50;
  transform: scale(1.1);
}

.search-input:not(:focus):not(:placeholder-shown) + .clear-button {
  opacity: 1;
}

.shine {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.6),
    transparent
  );
  border-radius: 8px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.search-input:focus + .shine {
  opacity: 1;
}

.search-icon {
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  color: #999;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease, filter 0.3s ease;
  border-radius: 50%;
}

.search-input:focus + .search-icon {
  color: #4caf50;
  transform: translateY(-50%) scale(1.1);
  filter: drop-shadow(0 0 5px rgba(76, 175, 80, 0.6));
}

@keyframes inputPulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.search-input:focus {
  animation: inputPulse 0.5s ease;
}

</style>
