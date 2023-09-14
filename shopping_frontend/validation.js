function validator(formSelector) {
    
    var _this = this
    var formRules = {}

    function getParent (element, selector) {
        while(element.parentElement){
            if (element.parentElement.matches(selector)){
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    /*
    Quy uoc tao rule:
    1/ Dung (khong co loi) thi in ra `undefined`
    2/ Sai (co loi) thi in ra `error message`
    */
    var validatorRules = {
        required: function (value) {
            return value ? undefined : `Vui long nhap truong nay`
        },
        email: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            return regex.test(value) ? undefined : `Truong nay phai la email`
        },
        min: function (min) {
            return function (value) {
                return value.length >= min ? undefined : `Vui long nhap toi thieu ${min} ky tu`
            }
        }
    }


    //Lay ra form element trong DOM theo `formSelector`
    var formElement = document.querySelector(formSelector)

    //Chi xu ly khi co element trong DOM
    if (formElement) {

        var inputs = formElement.querySelectorAll('[name][rule]')

        for (var input of inputs) {

            var rules = input.getAttribute('rule').split('|')

            for (var rule of rules) {

                if(rule.includes(':')){
                    var ruleInfo=rule.split(':')

                    rule=ruleInfo[0]
                    validatorRules[rule]=validatorRules[ruleInfo[0]](ruleInfo[1])
                }

                if (Array.isArray(formRules[input.name])){
                    formRules[input.name].push(validatorRules[rule])
                } else {
                    formRules[input.name] = [validatorRules[rule]]
                }
            }

            //Lang nghe su kien de validate(blur,change,...)

            input.onblur = handleValidate
            input.oninput = handleCLearError

        }

        //Ham thuc hien validate
        function handleValidate(event) {
            var rules = formRules[event.target.name]
            var errorMessage

            for (var rule of rules) {
                errorMessage = rule(event.target.value)
                if (errorMessage) break
            }

            //neu co loi thi hien thi message qua UI
            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group')

                if (formGroup) {
                    var formMessage = formGroup.querySelector('.form-message')

                    if(formMessage) {
                        formMessage.innerText = errorMessage
                        formGroup.classList.add('invalid')
                    }
                }
            }

            // Khong co loi tra ve True, co loi tra ve False
            return !errorMessage
        }

        //Ham clear message loi
        function handleCLearError(event) {
            var formGroup = getParent(event.target, '.form-group')

            if(formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid')
                var formMessage = formGroup.querySelector('.form-message')
                
                if(formMessage) {
                    formMessage.innerText = ''
                }
            }
        }
    }

    //Xu ly hanh vi submit form
    formElement.onsubmit = function (event) {
        event.preventDefault()

        var inputs = formElement.querySelectorAll('[name][rule]')
        var isValid = true

        for (var input of inputs) {
            /*
            handleValidate(event) = handleValidate({ target: input})
            => event = { target: input }
            => event.target có giá trị là input.
            giống toán f(x) = f(y) suy ra x = y
            */
            if (!handleValidate({target: input})){
                isValid = false
            }
        }

        //Khi khong co loi thi submit form
        if (isValid) {
                //Truong hop submit voi javascript
                if (typeof _this.onSubmit === 'function') {

                    // Select tat ca attribute la name
                    var enableInputs = formElement.querySelectorAll('[name]')

                    //Chuyen enableInputs tu kieu nodeList sang kieu array 
                    var formValues = Array.from(enableInputs).reduce(function(value, input){
                        //Gan input.value cho value[input.name]
                        switch(input.type){
                            case 'radio':
                                value[input.name] = formElement.querySelector('input[name="' + input.name +  '"]:checked').value
                                break
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    value[input.name] = ''
                                    return value
                                }
                                if (!Array.isArray(value[input.name])) {
                                    value[input.name] = []
                                }

                                value[input.name].push(input.value)
                                break
                            case 'file' :
                                value[input.name] = input.files
                                break
                            default:
                                value[input.name] = input.value
                        }
                        //return value sau khi duoc gan
                        return value
                    }, {})

                    _this.onSubmit(formValues)
                } 
                //Truong hop submit voi hanh vi mac dinh
                else {
                    formElement.submit()
                }
        }
    }
}