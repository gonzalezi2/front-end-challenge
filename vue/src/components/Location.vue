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
                <p>Most Popular Agreement: <strong>{{commAgreements}}</strong></p>
                <p>Most Popular Agreement on Busiest Weekday: <strong>{{commMpaAgreements}}</strong></p>
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
            memberAgreements: [],
            busiestWeekdays: [],
            agreementTypes: {},
            mostPopularAgreement: [],
            mpaOnBusiestWeekday: [],
            selected: Number
        }
    },
    computed: {
        commaDays: function() {
            return this.busiestWeekdays.join(" ").split(" ").join(", ");
        },
        commAgreements: function() {
            return this.mostPopularAgreement.join(" ").split(" ").join(", ");
        },
        commMpaAgreements: function() {
            return this.mpaOnBusiestWeekday.join(" ").split(" ").join(", ");
        }
    },
    watch: {
        dates: {
            deep: true,
            handler() {
                this.filterCheckins();
                this.findBusiestWeekday();
                this.findMostPopularAgreement();
                this.findWeekdayAgreements();
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
                this.memberAgreements = agreements.body.data;
                this.agreementTypes = agreements.body.metadata.agreementTypes;
            })
            //.then(this.filterCheckins)
            .then(this.findBusiestWeekday)
            .then(this.findMostPopularAgreement)
            .then(this.findWeekdayAgreements);
        },
        filterCheckins: function() {            
            this.locationCheckins = this.locationCheckins.filter((checkin, index) => {
                return checkin.date >= this.dates.startDate && checkin.date <= (this.dates.endDate || new Date());
            });
        },
        findMode: function(arr) {
            var mappedCounts = new Map();
            var current = "";
            var counter;
            var mode = [];

            // Sorts the array to make counting easier
            arr.sort().forEach(item => {
                // increases counter for all non-unique items
                current === item ? counter++ : counter = 1;
                // sets item as new key on map or increases its count
                mappedCounts.set(item, counter);
                current = item;
            });
            // Takes mappedCounts from map object to sort in descending order
            var sortedCounts = Array.from(mappedCounts.values()).sort((a, b) => b - a);

            // Takes the most occurring instance after the sort of the array and pushes
            // all map values into the mode array to get the mode
            for (const [key, value] of mappedCounts) {
                if(value === sortedCounts[0]) {
                    mode.push(key);
                }
            }
            return mode;        
        },
        findBusiestWeekday: function() {
            let weekday = [];
            //Pushes a day-formatted string into the weekday array
            this.locationCheckins.forEach(checkin => {
                weekday.push(moment(checkin.date).format('dddd'));
            });
            this.busiestWeekdays = this.findMode(weekday);
        },
        findMostPopularAgreement: function() {
            let agreements = [];
            this.memberAgreements.forEach(item => {
                agreements.push(this.agreementTypes[item.agreement]);
            });
            this.mostPopularAgreement = this.findMode(agreements);
        },
        findWeekdayAgreements: function() {
            let popularWeekdays = [];
            let memberIds = new Set();
            let agreements = [];
            
            this.busiestWeekdays.forEach(day => {
                // Filters location check-ins to just those check-ins from the busiest days
                popularWeekdays = this.locationCheckins.filter(function(loc){
                    return moment(loc.date).format('dddd') === day;
                });
            });

            // Gets all the member ids on the filtered weekdays
            popularWeekdays.forEach(day => {
                memberIds.add(day.memberId);
            });

            // Loop through memberIds and get the agreements
            memberIds.forEach(id => {
                this.memberAgreements.forEach(member => {
                    if(member.memberId === id) {
                        agreements.push(this.agreementTypes[member.agreement]);
                    }
                });
            });
            this.mpaOnBusiestWeekday = this.findMode(agreements);
        }
    }
}
</script>