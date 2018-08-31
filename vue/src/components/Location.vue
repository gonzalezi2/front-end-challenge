<template>
    <div class="col-12 col-sm-6 mb-4">
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-10">
                    <label for="location-select">Location</label>
                    <select class="form-control"
                            v-model="selected"
                            id="location-select"
                            aria-label="select a location">
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
                        <button type="button" class="close" aria-label="remove location" v-on:click="$emit('delete-widget', widget)">
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
import axios from 'axios';

export default {
    name: 'Location',
    props: {
        widget: Object,
        listOfLocations: Array,
        dates: Object
    },
    data() {
        return {
            locationCheckins: [],
            filteredCheckins: [],
            memberAgreements: [],
            busiestWeekdays: [],
            agreementTypes: {},
            mostPopularAgreement: [],
            mpaOnBusiestWeekday: [],
            selected: Number
        }
    },
    computed: {
        commaDays() {
            return this.commaSeparated(this.busiestWeekdays);
        },
        commAgreements() {
            return this.commaSeparated(this.mostPopularAgreement)
        },
        commMpaAgreements() {
            return this.commaSeparated(this.mpaOnBusiestWeekday)
        }
    },
    watch: {
        dates: {
            deep: true,
            handler() {
                this.filterCheckins();
            }
        },
        selected: {
            handler(selected) {
                let checkinsURL = `https://code-challenge-api.club-os.com/api/locations/${selected}/member-checkins`;
                let agreementsURL = `https://code-challenge-api.club-os.com/api/locations/${selected}/member-agreements`;

                Promise.all([
                    axios.get(checkinsURL), axios.get(agreementsURL)
                ])
                .then(([checkins, agreements]) => {
                    this.locationCheckins = checkins.data.data;
                    this.memberAgreements = agreements.data.data;
                    this.agreementTypes = agreements.data.metadata.agreementTypes;
                    this.filterCheckins()
                });
            }
        }
    },
    methods: {
        filterCheckins() {
            let start = this.dates.startDate;
            let end = this.dates.endDate || moment().format();
            this.filteredCheckins = this.locationCheckins.filter(function(checkin, index) {
                return start === "" ? true : checkin.date >= start && checkin.date <= end;
            });
            this.updateStats();
        },
        findMode(arr) {
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
        findBusiestWeekday() {
            let weekday = [];
            //Pushes a day-formatted string into the weekday array
            this.filteredCheckins.forEach(checkin => {
                weekday.push(moment(checkin.date).format('dddd'));
            });
            this.busiestWeekdays = this.findMode(weekday);
        },
        findMostPopularAgreement() {
            let agreements = [];
            let filteredMembers = [];
            let memberIds = [];
            // Get all the member ids from filtered checkins
            this.filteredCheckins.forEach(checkin => {
                memberIds.push(checkin.memberId);
            });
            // Get all agreements based on member ids found on the filtered checkins
            memberIds.forEach(id => {
                filteredMembers = this.memberAgreements.filter(function(item){
                    return item.memberId === id;
                });
            });
            // Get all the agreement types from the array of filtered members array
            filteredMembers.forEach(item => {
                agreements.push(this.agreementTypes[item.agreement]);
            });
            this.mostPopularAgreement = this.findMode(agreements);
        },
        findWeekdayAgreements() {
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
        },
        updateStats() {
            this.findBusiestWeekday();
            this.findMostPopularAgreement();
            this.findWeekdayAgreements();
        },
        commaSeparated(arr) {
            return arr.join(" ").split(" ").join(", ");
        }
    }
}
</script>