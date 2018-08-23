<template>
    <div class="col-12 col-sm-6 mb-4">
        <div class="card">
            <div class="card-header">
                <div class="row">
                    <div class="col-10">
                    <select class="form-control">
                        <option v-for="location in listOfLocations" :value="location.id">{{location.name}}</option>
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
                <p>Busiest Weekday: {{busiestWeekday}}</p>
                <p>Most Popular Agreement: {{mostPopularAgreement}}</p>
                <p>Most Popular Agreement on Busiest Weekday: {{mpaOnBusiestWeekday}}</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Location',
    props: {
        widget: Object,
        listOfLocations: Array
    },
    data: function() {
        return {
            busiestWeekday: "Tuesday",
            mostPopularAgreement: "PLATINUM",
            mpaOnBusiestWeekday: "PLATINUM"
        }
    }
}
</script>