Vue.use(VueMask.VueMaskPlugin)

var vm = new Vue({
  el: "#main-form",

  data: function() {
    return {
      endPointURL:
        "https://hook.integromat.com/e58pt52v9cjs9we993e2y9d13djsxdcb", // Change your endpoint URL here
      buttonText: "Next",
      showButton: true,
      smallerButtonSize: false,
      showConfirmation: false,
      formStep: 0,
      showError: false,
      city: "",
      stateAbbreviation: "",
      stateZipCode: "",
      finalObject: {},
      formStepData: [
        {
          question: "Where do you need your new windows installed?",
          value: null,
          pattern: /(^\d{5}$)|(^\d{5}-\d{4}$)/
        },
        {
          question: "How many new windows do you need installed?",
          value: "",
          pattern: /[a-z0-9]/
        },
        {
          question:
            'How soon do you want to <br class="desktop-only"> begin your project?',
          value: "",
          pattern: /[a-z0-9]/
        },
        {
          question: "Are you interested in financing?",
          value: "",
          pattern: /[a-z0-9]/
        },
        {
          question: "What is your project address?",
          value: "",
          pattern: /[a-z0-9]/
        },
        {
          question: "Almost done",
          firstName: "",
          lastName: "",
          pattern: /[a-z0-9]/
        },
        {
          question: "Final Step",
          phoneNumber: "",
          emailAddress: "",
          patternPhone: /^1?\s?(\([0-9]{3}\)[- ]?|[0-9]{3}[- ]?)[0-9]{3}[- ]?[0-9]{4}$/,
          patternEmail: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        }
      ]
    }
  },

  methods: {
    increaseFormStep: function() {
      if (this.formStep === 0) {
        this.fireStep0Data()
        this.scrollToTop()
      } else if (this.formStep === 1) {
        this.fireStep1Data()
        this.scrollToTop()
      } else if (this.formStep === 2) {
        this.fireStep2Data()
        this.scrollToTop()
      } else if (this.formStep === 3) {
        this.fireStep4Data()
        this.scrollToTop()
      } else if (this.formStep === 4) {
        this.fireStep5Data()
        this.scrollToTop()
      } else if (this.formStep === 5) {
        this.fireStep6Data()
        this.scrollToTop()
      } else if (this.formStep === 6) {
        this.fireStep7Data()
        this.scrollToTop()
      }
    },

    fireStep0Data: function() {
      if (
        this.formStepData[this.formStep].pattern.test(
          this.formStepData[this.formStep].value
        )
      ) {
        axios
          .get(
            "https://maps.googleapis.com/maps/api/geocode/json?address=" +
              this.formStepData[0].value +
              "&key=AIzaSyAI-0x82SSTmuM_bFWdh26gh4M0II3uVVY"
          )
          .then(function(response) {
            var responseArray = response.data.results[0].address_components
            responseArray.map(function(item) {
              var types = item.types

              types.map(function(type) {
                if (type === "locality") {
                  vm.city = item.short_name
                } else if (type === "neighborhood") {
                  vm.city = item.short_name
                } else if (type === "administrative_area_level_1") {
                  vm.stateAbbreviation = item.short_name
                }
              })
            })

            vm.stateZipCode = vm.formStepData[0].value
            vm.formStep++
            vm.showError = false
          })
          .catch(function(error) {
            vm.showError = true
          })
      } else {
        this.showError = true
      }
    },

    fireStep1Data: function() {
      this.standardStepFire()
    },

    fireStep2Data: function() {
      this.standardStepFire()
    },

    fireStep4Data: function() {
      this.standardStepFire()
    },

    fireStep5Data: function() {
      this.standardStepFire()
    },

    fireStep6Data: function() {
      if (
        this.formStepData[this.formStep].pattern.test(
          this.formStepData[this.formStep].firstName
        ) &&
        this.formStepData[this.formStep].pattern.test(
          this.formStepData[this.formStep].lastName
        )
      ) {
        this.formStep++
        this.showError = false
        this.showConfirmation = true
        this.buttonText = "Get Estimate"
        this.smallerButtonSize = true
      } else {
        this.showError = true
      }
    },

    fireStep7Data: function() {
      if (
        this.formStepData[this.formStep].patternPhone.test(
          this.formStepData[this.formStep].phoneNumber
        ) &&
        this.formStepData[this.formStep].patternEmail.test(
          this.formStepData[this.formStep].emailAddress
        )
      ) {
        this.finalObject = {
          firstName: this.formStepData[5].firstName,
          lastName: this.formStepData[5].lastName,
          phoneNumber: this.formStepData[6].phoneNumber,
          emailAddress: this.formStepData[6].emailAddress,
          projectAddress: this.formStepData[4].value,
          city: this.city,
          zipCode: this.stateZipCode,
          state: this.stateAbbreviation,
          numWindowsInstalled: this.formStepData[1].value,
          howSoon: this.formStepData[2].value,
          financing: this.formStepData[3].value
        }

        axios({
          method: "post",
          url: this.endPointURL,
          data: this.finalObject
        })
          .then(function(response) {
            console.log(response)
          })
          .catch(function(error) {
            console.log(error)
          })

        this.formStep++
        this.showError = false
        this.showConfirmation = false

        setTimeout(function() {
          var headlineSection = document.querySelector(
            ".main-content__headline-section"
          )
          headlineSection.parentNode.removeChild(headlineSection)
          vm.showButton = false
        }, 400)
      } else {
        this.showError = true
      }
    },

    standardStepFire: function() {
      if (
        this.formStepData[this.formStep].pattern.test(
          this.formStepData[this.formStep].value
        )
      ) {
        this.formStep++
        this.showError = false
      } else {
        this.showError = true
      }
    },

    resetError: function() {
      this.showError = false
    },

    onSelectRadio: function(event) {
      this.formStepData[this.formStep].value = event.target.value
      this.resetError()
    },

    scrollToTop: function() {
      window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
    }
  }
})

// window.addEventListener(`scroll`, function() {
//   var mainHeader = document.querySelector(".main-header")
//   var mainHero = document.querySelector(".main-hero")

//   if (window.scrollY >= 100) {
//     mainHeader.classList.add("u-sm-fixed")
//     mainHero.classList.add("u-pt-100")
//   } else {
//     mainHeader.classList.remove("u-sm-fixed")
//     mainHero.classList.remove("u-pt-100")
//   }
// })
