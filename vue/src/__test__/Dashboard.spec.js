import Dashboard from '../components/Dashboard.vue'
import { shallowMount } from '@vue/test-utils'

describe('Dashboard.spec.js', () => {

    it('adds a new location to widgets object when the button is clicked', () => {
        const wrapper = shallowMount(Dashboard)
        const button = wrapper.find('#add-location')

        expect(wrapper.vm.widgets).toHaveLength(0)
        button.trigger('click')
        expect(wrapper.vm.widgets).toHaveLength(1)
    });
})