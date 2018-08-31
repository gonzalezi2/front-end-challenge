<template>
  <div class="my-5 card">
    <div class="card-header">
    <h1 class="text-center">Promotion Analytics</h1>
    <hr>
    <p class="text-center"><strong>Filter Date:</strong></p>
    <div class="row">
      <div class="col">
        <label for="start-date">Start</label>
        <input
          type="date"
          id="start-date"
          class="form-control"
          aria-label="start-date"
          accesskey="0"
          :max="dates.endDate"
          v-model="dates.startDate"
          >
      </div>
      <div class="col">
        <label for="end-date">End</label>
        <input
          type="date"
          id="end-date"
          aria-label="end-date"
          accesskey="1"
          class="form-control"
          :min="dates.startDate"
          v-model="dates.endDate">
      </div>
    </div>
    </div>
    <div class="card-body">
      <div class="row" v-if="widgets.length>0">
        <Location
          v-for="widget in widgets"
          v-bind:widget="widget" 
          v-bind:key="widget.id"
          v-on:delete-widget="deleteWidget(widget)"
          :listOfLocations="listOfLocations"
          :dates="dates"
        />
      </div>
      <div class="mt-3" v-else>
        <p class="text-center">There does not seem to be anything here! You can start by adding a location</p>
      </div>
    </div>
    <div class="card-footer clearfix">        
      <button id="add-location" class="btn btn-success mb-1 float-right" v-on:click="addWidget" accesskey="3">Add Location</button>
    </div>
  </div>
</template>

<script>
import Location from './Location';
import Vue from 'vue';
import axios from 'axios';

export default {
  name: 'Dashboard',
  components: {Location},
  data() {
    return {
      dates: {
        startDate: "",
        endDate: ""
      },
      widgets: [],
      listOfLocations: [],
      counter: 1
    }
  },
  created() {
      axios
      .get('https://code-challenge-api.club-os.com/api/locations/')
      .then(response => {
        this.listOfLocations = response.data.data;
      })
      .catch(error => console.log(error));
  },
  methods: {
    deleteWidget(widget) {
      this.widgets.splice(this.widgets.indexOf(widget), 1);
    },
    addWidget() {
      this.widgets.push({
        id: this.counter
      });
      this.counter++;
    },
  }
}
</script>