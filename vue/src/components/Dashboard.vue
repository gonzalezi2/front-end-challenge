<template>
  <div class="my-5 card">
    <div class="card-header">
    <h1 class="text-center">Promotion Analytics</h1>
    <p class="text-center">Filter Date:</p>
    <div class="row">
      <div class="col">
        <label for="start-date">Start</label>
        <input
          type="date"
          id="start-date"
          class="form-control"
          :max="dates.endDate"
          v-model="dates.startDate"
          >
      </div>
      <div class="col">
        <label for="end-date">End</label>
        <input
          type="date"
          id="end-date"
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
      <button class="btn btn-success mb-1 float-right" v-on:click="addWidget">Add Location</button>
    </div>
  </div>
</template>

<script>
import Location from './Location';

export default {
  name: 'Dashboard',
  components: {Location},
  created: function(){
    this.$http.get('https://code-challenge-api.club-os.com/api/locations/').then(function(response){
      this.listOfLocations = response.data.data;
    })
  },
  data: function() {
    return {
      dates: {
        startDate: Date,
        endDate: Date
      },
      widgets: [],
      listOfLocations: [],
      counter: 1
    }
  },
  methods: {
    deleteWidget: function(widget) {
      this.widgets.splice(this.widgets.indexOf(widget), 1);
    },
    addWidget: function() {
      this.widgets.push({
        id: this.counter
      });
      this.counter++;
      console.log(this.widgets, this.counter);
    }
  }
}
</script>