<template>
  <div class="container mx-auto p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-gray-100">
    <h1 class="text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
      Admin Panel
    </h1>

    <!-- Case Qo'shish Formasi -->
    <div class="bg-gray-800 p-6 rounded-xl shadow-lg mb-10 border border-gray-700">
      <h2 class="text-2xl font-semibold mb-4 text-orange-400">Yangi Case Qo‘shish</h2>
      <div class="space-y-4">
        <input
          v-model="newCase.name"
          placeholder="Case nomi"
          class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100 placeholder-gray-400"
        />
        <input
          v-model="newCase.image"
          placeholder="Rasm URL"
          class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100 placeholder-gray-400"
        />
        <input
          v-model.number="newCase.probability"
          type="number"
          min="0"
          max="100"
          placeholder="Ehtimollik (%)"
          class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100 placeholder-gray-400"
        />
        <button
          @click="addCase"
          class="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-all duration-300 font-medium"
        >
          Qo‘shish
        </button>
      </div>
    </div>

    <!-- Tablar (Bo‘limlar) -->
    <div class="mb-10">
      <div class="flex space-x-4 border-b border-gray-700">
        <button
          @click="activeTab = 'cases'"
          :class="[
            'px-6 py-3 text-lg font-medium transition-all duration-300 rounded-t-lg',
            activeTab === 'cases' ? 'bg-gray-700 text-orange-400 border-b-2 border-orange-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-600'
          ]"
        >
          Case Ro‘yxati
        </button>
        <button
          @click="activeTab = 'keys'"
          :class="[
            'px-6 py-3 text-lg font-medium transition-all duration-300 rounded-t-lg',
            activeTab === 'keys' ? 'bg-gray-700 text-orange-400 border-b-2 border-orange-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-600'
          ]"
        >
          Key Ro‘yxati
        </button>
        <button
          @click="activeTab = 'gifts'"
          :class="[
            'px-6 py-3 text-lg font-medium transition-all duration-300 rounded-t-lg',
            activeTab === 'gifts' ? 'bg-gray-700 text-orange-400 border-b-2 border-orange-500' : 'bg-gray-800 text-gray-400 hover:bg-gray-600'
          ]"
        >
          Sovg‘alar Ro‘yxati
        </button>
      </div>

      <!-- Tab Kontenti -->
      <div class="mt-6">
        <!-- Case Ro‘yxati -->
        <div v-if="activeTab === 'cases'" class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 class="text-2xl font-semibold mb-4 text-orange-400">Case Ro‘yxati</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-700 text-gray-300">
                  <th class="p-4 text-sm font-medium">Nomi</th>
                  <th class="p-4 text-sm font-medium">Rasm</th>
                  <th class="p-4 text-sm font-medium">Ehtimollik</th>
                  <th class="p-4 text-sm font-medium">Sovg‘a</th>
                  <th class="p-4 text-sm font-medium">Amallar</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(caseItem, index) in $root.cases"
                  :key="index"
                  class="border-b border-gray-700 hover:bg-gray-700 transition-all duration-200"
                >
                  <td class="p-4 text-sm">{{ caseItem.name }}</td>
                  <td class="p-4 text-sm">
                    <img :src="caseItem.image" alt="case" class="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td class="p-4 text-sm">{{ caseItem.probability }}%</td>
                  <td class="p-4 text-sm">{{ caseItem.associatedGift ? caseItem.associatedGift.name : "Yo‘q" }}</td>
                  <td class="p-4 text-sm space-x-2">
                    <button
                      @click="editCase(index)"
                      class="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                    >
                      Tahrir
                    </button>
                    <button
                      @click="confirmDeleteCase(index)"
                      class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                    >
                      O‘chir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Key Ro‘yxati -->
        <div v-if="activeTab === 'keys'" class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 class="text-2xl font-semibold mb-4 text-orange-400">Key Ro‘yxati</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-700 text-gray-300">
                  <th class="p-4 text-sm font-medium">Key</th>
                  <th class="p-4 text-sm font-medium">Rasm</th>
                  <th class="p-4 text-sm font-medium">Sovg‘a</th>
                  <th class="p-4 text-sm font-medium">Holati</th>
                  <th class="p-4 text-sm font-medium">Amallar</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(key, index) in $root.keys"
                  :key="index"
                  class="border-b border-gray-700 hover:bg-gray-700 transition-all duration-200"
                >
                  <td class="p-4 text-sm">{{ key }}</td>
                  <td class="p-4 text-sm">
                    <img :src="`https://via.placeholder.com/50?text=Key${index}`" alt="key" class="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td class="p-4 text-sm">{{ $root.keyGifts[key] ? $root.keyGifts[key].name : "Yo‘q" }}</td>
                  <td class="p-4 text-sm">
                    <span
                      :class="{
                        'text-green-400': !$root.usedKeys.includes(key),
                        'text-red-400': $root.usedKeys.includes(key),
                      }"
                    >
                      {{ $root.usedKeys.includes(key) ? 'Ishlatilgan' : 'Ishlatilmagan' }}
                    </span>
                  </td>
                  <td class="p-4 text-sm space-x-2">
                    <button
                      @click="editKey(index)"
                      class="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                    >
                      Tahrir
                    </button>
                    <button
                      @click="confirmDeleteKey(index)"
                      class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                    >
                      O‘chir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Sovg‘alar Ro‘yxati -->
        <div v-if="activeTab === 'gifts'" class="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <h2 class="text-2xl font-semibold mb-4 text-orange-400">Sovg‘alar Ro‘yxati</h2>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-700 text-gray-300">
                  <th class="p-4 text-sm font-medium">Nomi</th>
                  <th class="p-4 text-sm font-medium">Rasm</th>
                  <th class="p-4 text-sm font-medium">Ehtimollik</th>
                  <th class="p-4 text-sm font-medium">Turi</th>
                  <th class="p-4 text-sm font-medium">Amallar</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(gift, index) in $root.gifts"
                  :key="index"
                  class="border-b border-gray-700 hover:bg-gray-700 transition-all duration-200"
                >
                  <td class="p-4 text-sm">{{ gift.name }}</td>
                  <td class="p-4 text-sm">
                    <img :src="gift.image" alt="gift" class="w-12 h-12 rounded-lg object-cover" />
                  </td>
                  <td class="p-4 text-sm">{{ gift.probability }}%</td>
                  <td class="p-4 text-sm">
                    <span
                      :class="{
                        'text-blue-400': gift.type === 'big',
                        'text-green-400': gift.type === 'small',
                      }"
                    >
                      {{ gift.type === 'big' ? 'Katta' : 'Kichik' }}
                    </span>
                  </td>
                  <td class="p-4 text-sm space-x-2">
                    <button
                      @click="editGift(index)"
                      class="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all duration-200"
                    >
                      Tahrir
                    </button>
                    <button
                      @click="confirmDeleteGift(index)"
                      class="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all duration-200"
                    >
                      O‘chir
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-6 space-y-4">
            <h3 class="text-xl font-semibold text-orange-400">Yangi Sovg‘a Qo‘shish</h3>
            <input
              v-model="newGift.name"
              placeholder="Nomi"
              class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100 placeholder-gray-400"
            />
            <input
              v-model="newGift.image"
              placeholder="Rasm URL"
              class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100 placeholder-gray-400"
            />
            <input
              v-model.number="newGift.probability"
              type="number"
              min="0"
              max="100"
              placeholder="Ehtimollik (%)"
              class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100 placeholder-gray-400"
            />
            <select
              v-model="newGift.type"
              class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100"
            >
              <option value="big">Katta</option>
              <option value="small">Kichik</option>
            </select>
            <button
              @click="addGift"
              class="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-all duration-300 font-medium"
            >
              Qo‘shish
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Tahrirlash Modal -->
    <div v-if="isEditing" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md transform transition-all duration-300 scale-100">
        <h3 class="text-2xl font-semibold mb-4 text-orange-400">{{ editType }} Tahrirlash</h3>
        <input
          v-model="editedItem.name"
          placeholder="Nomi"
          class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100 placeholder-gray-400 mb-4"
        />
        <input
          v-model="editedItem.image"
          placeholder="Rasm URL"
          class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100 placeholder-gray-400 mb-4"
        />
        <input
          v-model.number="editedItem.probability"
          type="number"
          min="0"
          max="100"
          placeholder="Ehtimollik (%)"
          class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100 placeholder-gray-400 mb-4"
        />
        <select
          v-model="editedItem.type"
          class="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-gray-100 mb-4"
        >
          <option value="big">Katta</option>
          <option value="small">Kichik</option>
        </select>
        <div class="flex justify-end space-x-3">
          <button
            @click="saveEdit"
            class="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-200"
          >
            Saqlash
          </button>
          <button
            @click="cancelEdit"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
          >
            Bekor
          </button>
        </div>
      </div>
    </div>

    <!-- O'chirish Tasdiqlash Modal -->
    <div v-if="isDeleting" class="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div class="bg-gray-800 p-6 rounded-xl shadow-lg text-center transform transition-all duration-300 scale-100">
        <p class="mb-4 text-lg text-gray-100">Haqiqatdan ham o‘chirilsinmi?</p>
        <div class="flex justify-center space-x-3">
          <button
            @click="deleteItem"
            class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
          >
            Ha
          </button>
          <button
            @click="cancelDelete"
            class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
          >
            Yo‘q
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'cases', // Default tab
      newCase: { name: "", image: "", probability: 0 },
      newGift: { name: "", image: "", probability: 0, type: "small" },
      gifts: [],
      isEditing: false,
      isDeleting: false,
      editType: '',
      editedItem: { name: "", image: "", probability: 0, type: "small" },
      editIndex: null,
      deleteIndex: null,
      deleteType: '',
    };
  },
  created() {
    if (this.$root.keys.length === 0) {
      this.generateKeys();
    }
    if (!this.$root.gifts || this.$root.gifts.length === 0) {
      this.initializeGifts();
    }
  },
  methods: {
    addCase() {
      if (this.newCase.name && this.newCase.image && this.newCase.probability >= 0) {
        this.$root.cases.push({ ...this.newCase, associatedGift: this.$root.gifts[0] || null });
        this.newCase = { name: "", image: "", probability: 0 };
      }
    },
    generateKeys() {
      const keys = [];
      for (let i = 0; i < 100; i++) {
        const key = `KEY-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        keys.push(key);
      }
      this.$root.keys = keys;
    },
    initializeGifts() {
      const bigGifts = [
        { name: "AWP Dragon", image: "https://via.placeholder.com/80?text=AWP+Dragon", probability: 5, type: "big" },
        { name: "Karambit Fade", image: "https://via.placeholder.com/80?text=Karambit+Fade", probability: 5, type: "big" },
        { name: "M4A4 Howl", image: "https://via.placeholder.com/80?text=M4A4+Howl", probability: 5, type: "big" },
        { name: "AK-47 Fire", image: "https://via.placeholder.com/80?text=AK-47+Fire", probability: 5, type: "big" },
        { name: "Glock Fade", image: "https://via.placeholder.com/80?text=Glock+Fade", probability: 5, type: "big" },
      ];

      const smallGifts = [
        { name: "P250 Sand", image: "https://via.placeholder.com/80?text=P250+Sand", probability: 10, type: "small" },
        { name: "Tec-9 Red", image: "https://via.placeholder.com/80?text=Tec-9+Red", probability: 10, type: "small" },
        { name: "MP9 Bio", image: "https://via.placeholder.com/80?text=MP9+Bio", probability: 10, type: "small" },
      ];

      const allGifts = [...bigGifts, ...smallGifts];
      this.$root.gifts = allGifts;
      this.$root.keyGifts = {};

      this.$root.keys.forEach((key, index) => {
        const giftIndex = Math.floor(Math.random() * allGifts.length);
        this.$root.keyGifts[key] = allGifts[giftIndex];
      });

      this.$root.cases.forEach((caseItem, index) => {
        caseItem.associatedGift = allGifts[index % allGifts.length];
      });
    },
    addGift() {
      if (this.newGift.name && this.newGift.image && this.newGift.probability >= 0 && this.newGift.type) {
        this.$root.gifts.push({ ...this.newGift });
        this.newGift = { name: "", image: "", probability: 0, type: "small" };
        this.$root.keys.forEach((key, index) => {
          const giftIndex = Math.floor(Math.random() * this.$root.gifts.length);
          this.$root.keyGifts[key] = this.$root.gifts[giftIndex];
        });
        this.$root.cases.forEach((caseItem, index) => {
          caseItem.associatedGift = this.$root.gifts[index % this.$root.gifts.length];
        });
      }
    },
    editCase(index) {
      this.editType = 'Case';
      this.editedItem = { ...this.$root.cases[index], associatedGift: this.$root.cases[index].associatedGift };
      this.editIndex = index;
      this.isEditing = true;
    },
    editKey(index) {
      this.editType = 'Key';
      this.editedItem = { name: this.$root.keys[index], image: `https://via.placeholder.com/50?text=Key${index}`, probability: 0, type: "key" };
      this.editIndex = index;
      this.isEditing = true;
    },
    editGift(index) {
      this.editType = 'Sovg\'a';
      this.editedItem = { ...this.$root.gifts[index] };
      this.editIndex = index;
      this.isEditing = true;
    },
    saveEdit() {
      if (this.editType === 'Case') {
        this.$root.cases[this.editIndex] = { ...this.editedItem, associatedGift: this.$root.cases[this.editIndex].associatedGift };
      } else if (this.editType === 'Key') {
        this.$root.keys[this.editIndex] = this.editedItem.name;
      } else if (this.editType === 'Sovg\'a') {
        this.$root.gifts[this.editIndex] = { ...this.editedItem };
        this.$root.keys.forEach((key, index) => {
          const giftIndex = Math.floor(Math.random() * this.$root.gifts.length);
          this.$root.keyGifts[key] = this.$root.gifts[giftIndex];
        });
        this.$root.cases.forEach((caseItem, index) => {
          caseItem.associatedGift = this.$root.gifts[index % this.$root.gifts.length];
        });
      }
      this.cancelEdit();
    },
    cancelEdit() {
      this.isEditing = false;
      this.editedItem = { name: "", image: "", probability: 0, type: "small" };
      this.editIndex = null;
    },
    confirmDeleteCase(index) {
      this.deleteType = 'Case';
      this.deleteIndex = index;
      this.isDeleting = true;
    },
    confirmDeleteKey(index) {
      this.deleteType = 'Key';
      this.deleteIndex = index;
      this.isDeleting = true;
    },
    confirmDeleteGift(index) {
      this.deleteType = 'Sovg\'a';
      this.deleteIndex = index;
      this.isDeleting = true;
    },
    deleteItem() {
      if (this.deleteType === 'Case') {
        this.$root.cases.splice(this.deleteIndex, 1);
      } else if (this.deleteType === 'Key') {
        this.$root.keys.splice(this.deleteIndex, 1);
        delete this.$root.keyGifts[this.$root.keys[this.deleteIndex]];
      } else if (this.deleteType === 'Sovg\'a') {
        this.$root.gifts.splice(this.deleteIndex, 1);
        this.$root.keys.forEach((key, index) => {
          const giftIndex = Math.floor(Math.random() * this.$root.gifts.length);
          this.$root.keyGifts[key] = this.$root.gifts[giftIndex];
        });
        this.$root.cases.forEach((caseItem, index) => {
          caseItem.associatedGift = this.$root.gifts[index % this.$root.gifts.length];
        });
      }
      this.cancelDelete();
    },
    cancelDelete() {
      this.isDeleting = false;
      this.deleteIndex = null;
      this.deleteType = '';
    },
  },
};
</script>