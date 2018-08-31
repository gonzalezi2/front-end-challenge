import { shallowMount } from '@vue/test-utils'
import Dashboard from '../components/Dashboard.vue'
import Location from '../components/Location.vue'
import axios from 'axios'

describe('Location.vue', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(Location)
        wrapper.setProps({
            listOfLocations: [
                {id: 1, name: "Center City"
                },
                { id: 2, name: "Bella Vista"
                },
                { id: 3, name: "Fishtown"
                },
                { id: 4, name: "Fairmount"
                }
            ]
        })

    })
    it('should have a dropwdown with 5 options (4 being locations and 1 as a placeholder))', () => {
        expect(wrapper.findAll('option').length).toBe(5)
    })
    it('should initialize variables with empty values', () => {        
        expect(wrapper.vm.busiestWeekdays).toHaveLength(0)
        expect(wrapper.vm.mpaOnBusiestWeekday).toHaveLength(0)
        expect(wrapper.vm.mostPopularAgreement).toHaveLength(0)
        expect(wrapper.vm.locationCheckins).toHaveLength(0)
        expect(wrapper.vm.memberAgreements).toHaveLength(0)
        expect(wrapper.vm.agreementTypes).toEqual({})
    })
    it('should get all the relevant data when a location is selected', () => {

        wrapper.findAll('option').at(3).element.selected = true
        wrapper.find('#location-select').trigger('change')
        
        setTimeout(() => {        
            expect(wrapper.vm.busiestWeekdays).not.toHaveLength(0)
            expect(wrapper.vm.mpaOnBusiestWeekday).not.toHaveLength(0)
            expect(wrapper.vm.mostPopularAgreement).not.toHaveLength(0)
            expect(wrapper.vm.locationCheckins).not.toHaveLength(0)
            expect(wrapper.vm.memberAgreements).not.toHaveLength(0)
            expect(wrapper.vm.agreementTypes).toEqual({1: "BASIC",2: "PLATINUM",3: "VIP"})            
        }, 500);
        
    })
    it('should update the location stats on date change', () => {
        // Set date to a point that ensures there are checkins and the stats will update
        wrapper.setProps({dates: {startDate: '2018-01-31', endDate: ''}})

        wrapper.findAll('option').at(3).element.selected = true
        wrapper.find('#location-select').trigger('change')

        setTimeout(() => {        
            expect(wrapper.vm.commaDays).not.toHaveLength(0)
            expect(wrapper.vm.commAgreements).not.toHaveLength(0)
            expect(wrapper.vm.commMpaAgreements).not.toHaveLength(0)
        }, 500);

        // Now move the date forward to a point where there are no checkins
        wrapper.setProps({dates: {startDate: '2018-08-31', endDate: ''}})

        setTimeout(() => {        
            expect(wrapper.vm.commaDays).toHaveLength(0)
            expect(wrapper.vm.commAgreements).toHaveLength(0)
            expect(wrapper.vm.commMpaAgreements).toHaveLength(0)
        }, 500);
    })
})