<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="ml-10">
        <h2 class="text-2xl font-bold">List of Clients</h2>
        <h3 class="italic">Click table row to edit/display an entry</h3>
      </div>
      <div class="flex flex-col col-span-2">
        <table class="min-w-full shadow-md rounded">
          <thead class="bg-gray-50 text-xl">
            <tr>
              <th class="p-4 text-left">Attendees</th>
              <th class="p-4 text-left">Event Name</th>
              <th class="p-4 text-left">City</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr @click="editClient(client._id)" v-for="client in eventData" :key="client._id">
              <td class="p-2 text-left">{{ client.attendees }}</td>
              <td class="p-2 text-left">{{ client.eventName }}</td>
              <td class="p-2 text-left">{{ client.address.city }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
<script>
  import axios from "axios";
export default {
  data() {
    return {
      eventData: [],
      //Parameter for search to occur
      searchBy: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
    };
  },
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/`;
    axios.get(apiURL).then((resp) => {
      this.eventData = resp.data;
    });
    window.scrollTo(0, 0);
  },
  methods: {
    
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
    
  },
};
</script>
