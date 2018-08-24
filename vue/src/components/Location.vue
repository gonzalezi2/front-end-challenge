<template>
    <div class="col-12 col-sm-6 mb-4">
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-10">
                    <select class="form-control"
                            v-model="selected"
                            v-on:change="changedLocation(selected)">
                        <option selected disabled value="">Please select a location</option>
                        <option
                            v-for="location in listOfLocations"
                            v-bind:key="location.id"
                            v-bind:value="location.id"                            
                            >
                                {{location.name}}
                        </option>
                    </select>
                    {{busiestWeekdays}}
                    </div>
                    <div class="col-2">
                        <button type="button" class="close" aria-label="Close" v-on:click="$emit('delete-widget', widget)">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <p>Busiest Weekday(s): <strong>{{commaDays}} </strong></p>
                <p>Most Popular Agreement: <strong>{{mostPopularAgreement}}</strong></p>
                <p>Most Popular Agreement on Busiest Weekday: <strong>{{mpaOnBusiestWeekday}}</strong></p>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    name: 'Location',
    props: {
        widget: Object,
        listOfLocations: Array,
        dates: Object
    },
    data: function() {
        return {
            locationCheckins: [],
            locationAgreements: [],
            busiestWeekdays: [],
            agreementTypes: {},
            mostPopularAgreement: "",
            mpaOnBusiestWeekday: "",
            selected: Number
        }
    },
    computed: {
        commaDays: function() {
            return this.busiestWeekdays.join(" ").split(" ").join(", ");
        }
    },
    watch: {
        dates: {
            deep: true,
            handler() {
                this.filterCheckins();
                this.findBusiestWeekday();
            }
        }
    },
    methods: {
        changedLocation: function(selected) {
            let checkinsURL = `https://code-challenge-api.club-os.com/api/locations/${selected}/member-checkins`;
            let agreementsURL = `https://code-challenge-api.club-os.com/api/locations/${selected}/member-agreements`;
            
            Promise.all([
                this.$http.get(checkinsURL), this.$http.get(agreementsURL)
            ]).then(([checkins, agreements]) => {
                this.locationCheckins = checkins.body.data;
                this.locationAgreements = agreements.body.data;
                this.agreementTypes = agreements.body.metadata.agreementTypes;
            })
            .then(this.filterCheckins)
            .then(this.findBusiestWeekday);
        },
        filterCheckins: function() {
            this.locationCheckins = this.locationCheckins.filter((checkin, index) => {
                return checkin.date >= this.dates.startDate && checkin.date <= this.dates.endDate;
            });
        },
        findBusiestWeekday: function() {
            var weekday = [];
            var dayCounts = new Map();
            var currentDay = "";
            var counter = 1;
            var highestDays = [];
            //Pushes a day-formatted string into the weekday array
            this.locationCheckins.forEach(checkin => {
                weekday.push(moment(checkin.date).format('dddd'));
            });
            // Sorts the weekday array for counting, and resets counter on new day
            weekday.sort().forEach(day => {
                currentDay === day ? counter++ : counter = 1;
                dayCounts.set(day, counter);
                currentDay = day;
            });
            // Takes daycounts from map object to sort in descending order
            var sortedDayCounts = Array.from(dayCounts.values()).sort((a, b) => b - a);

            // Takes the highest checking count and pushes all days
            // that have the same number of checkins
            for (const [key, value] of dayCounts) {
                if(value === sortedDayCounts[0]) {
                    highestDays.push(key);
                }
            }
            console.log(this.busiestWeekdays, highestDays);
            this.busiestWeekdays = highestDays;
        }
    }
}
</script>