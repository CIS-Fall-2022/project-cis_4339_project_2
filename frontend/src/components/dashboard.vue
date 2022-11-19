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
              <th class="p-4 text-left">Event Name</th>
              <th class="p-4 text-left">Date</th>
              <th class="p-4 text-left">Attendees
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-300">
            <tr @click="editClient(total._id)" v-for="total in eventData" :key="total._id">
              <td class="p-2 text-left">{{ total._id.eventName }}</td>
              <td class="p-2 text-left">{{ total._id.date }}</td>
              <td class="p-2 text-center">{{ total.count }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
      <div class="ml-10">
        <h1 class="text-2xl font-bold">Number of Event Attendees</h1>
      </div>
      <div class="flex flex-col col-span-2">
      <div>
          <div>
            <TotalBar
              v-if="!loading && !error"
              :label="labels"
              :chart-data="count"
            ></TotalBar>

            <!-- Start of loading animation -->
            <div class="mt-40" v-if="loading">
              <p
                class="
                  text-6xl
                  font-bold
                  text-center text-gray-500
                  animate-pulse
                "
              >
                Loading...
              </p>
            </div>
            <!-- End of loading animation -->

            <!-- Start of error alert -->
            <div class="mt-12 bg-red-50" v-if="error">
              <h3 class="px-4 py-1 text-4xl font-bold text-white bg-red-800">
                {{ error.title }}
              </h3>
              <p class="p-4 text-lg font-bold text-red-900">
                {{ error.message }}
              </p>
            </div>
            <!-- End of error alert -->
            <br />
            <br />
          </div>
        </div>
      </div>
  </section>
  </main>
</template>
<script>
  import axios from "axios";
  import TotalBar from "@/components/BarChartComponent.vue";

export default {
  components: {
    TotalBar
  }, 
  data() {
    return {
      eventData: [],
      //Parameter for search to occur
      searchBy: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      labels: [],
      count: [],
      loading: false,
      error: null
    };
  },
  mounted() {
    let apiURL = import.meta.env.VITE_ROOT_API + `/eventdata/total/clientnumber`;
    axios.get(apiURL).then((resp) => {
      this.eventData = resp.data;
    });
    window.scrollTo(0, 0);
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        this.error = null;
        this.loading = true;
        const url = import.meta.env.VITE_ROOT_API + `/eventdata/total/clientnumber`;
        const response = await axios.get(url);
        //"re-organizing" - mapping json from the response
        this.labels = response.data.map((item) => item._id.eventName);
        this.count = response.data.map((item) => item.count);
      } catch (err) {
        if (err.response) {
          // client received an error response (5xx, 4xx)
          this.error = {
            title: "Server Response",
            message: err.message,
          };
        } else if (err.request) {
          // client never received a response, or request never left
          this.error = {
            title: "Unable to Reach Server",
            message: err.message,
          };
        } else {
          // There's probably an error in your code
          this.error = {
            title: "Application Error",
            message: err.message,
          };
        }
      }
      this.loading = false;
    },
    
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
    
  },
};
</script>
