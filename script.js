class Calculator {

   constructor(){}

    
    calculateFormula(formula, variables) {
        switch (formula) {
            case 'price':
                return variables.count * variables.fee - variables.discount; 
            case 'cylinderVolume':
                return Math.PI * Math.pow(variables.radius, 2) * variables.height; 
            case 'rectangleArea':
                return variables.width * variables.length; 
            default:
                return 0;
        }
    }
}

class InputField {
    constructor(id, validateCallback) {
        this.element = document.getElementById(id);
        this.errorElement = document.getElementById(id + 'Error');
        this.element.addEventListener('input', validateCallback);
    }

    getValue() {
        let value = this.element.value.trim();
        
        if (!/^(\d+(\.\d+)?|\.\d+)$/.test(value)) {
            return null; 
        }
        return parseFloat(value); 
    }
    

    setError(message) {
        this.errorElement.textContent = message;
        this.errorElement.style.display = message ? 'inline' : 'none';
    }

    validate(validationFunc) {
        validationFunc(this);
    }
}

class Application {
    constructor() {
        this.calculator = new Calculator();

        
        this.feeInput = new InputField('fee', () => this.validateFee());
        this.countInput = new InputField('count', () => this.validateCount());
        this.discountInput = new InputField('discount', () => this.validateDiscount());
        this.radiusInput = new InputField('radius', () => this.validateRadius());
        this.heightInput = new InputField('height', () => this.validateHeight());
        this.widthInput = new InputField('width', () => this.validateWidth());
        this.lengthInput = new InputField('length', () => this.validateLength());
       this.updatePrice = this.updatePrice.bind(this);
    }

    invalidFormula(id) {
        document.getElementById(id).textContent = `Invalid Formula`;
    }
    updatePrice()
    {
        const fee = this.feeInput.getValue();
        const count = this.countInput.getValue();
        const discount = this.discountInput.getValue();

        
        if (fee !== null && count !== null && discount !== null) {
           const price = this.calculator.calculateFormula('price', {  fee, count, discount  });
           if (price > 0) {
               document.getElementById('formula1').textContent = `Price: ${price}`;
           }
           } else{
               document.getElementById('formula1').textContent = 'Price: 0';
           }
       }
       updateVolume()
       {
        const radius = this.radiusInput.getValue();
        const height = this.heightInput.getValue();
        if (radius !== null && height !== null) {
            const volume = this.calculator.calculateFormula('cylinderVolume', { radius, height });
        
            if (volume > 0 && this.radiusInput.getValue()>0) {
                document.getElementById('cylinderVolume').textContent = `Cylinder volume: ${volume}`;
        }    } else if (this.radiusInput.getValue() > 0) {
                document.getElementById('cylinderVolume').textContent = 'Cylinder volume: 0';
            }
       }
       updateArea(){
        const width = this.widthInput.getValue();
        const length = this.lengthInput.getValue();
        if (width !== null && length !== null) {
            const area = this.calculator.calculateFormula('rectangleArea', { width, length });
            if (area > 0) {
                document.getElementById('rectangleArea').textContent = `Rectangle area: ${area}`;
        }  }   else {
                document.getElementById('rectangleArea').textContent = 'Rectangle area: 0';
            }
        
       }
    validateFee() {
        const value = this.feeInput.getValue();
        if (value !== null && value <= 0) {
            this.feeInput.setError('Fee must be a positive number.');
            this.invalidFormula('formula1');
        } else if (value === null && this.feeInput.element.value !== "") {
            this.feeInput.setError('Fee must be a valid number.');
            this.invalidFormula('formula1');
        } else {
            this.feeInput.setError('');
           this.updatePrice();
        }
    }
    validateCount() {
        const value = this.countInput.getValue();
        if (value !== null && value <= 0) {
            this.countInput.setError('Count must be a positive number.');
            this.invalidFormula('formula1');
        } else if (value === null && this.countInput.element.value !== "") {
            this.countInput.setError('Count must be a valid number.');
            this.invalidFormula('formula1');
        } else {
            this.countInput.setError('');
            this.updatePrice();
        }
    }
    validateDiscount() {
        const value = this.discountInput.getValue();
        const fee = this.feeInput.getValue();
        const discount = this.discountInput.getValue();
        if (value !== null && value < 0) {
            this.discountInput.setError('Discount must be a non-negative number.');
            this.invalidFormula('formula1');
        } else if ((value === null && this.discountInput.element.value !== "") || 
        (discount!==null && fee !==null && value> fee * discount)) {
            this.discountInput.setError('Discount must be a valid number.');
            this.invalidFormula('formula1');
        } else {
            this.discountInput.setError('');
           this.updatePrice();
        }
    }
    validateRadius() {
        const value = this.radiusInput.getValue();
        if (value !== null && value <= 0) {
            this.radiusInput.setError('Radius must be a positive number.');
            this.invalidFormula('cylinderVolume');
        } else if (value === null && this.radiusInput.element.value !== "") {
            this.radiusInput.setError('Radius must be a valid number.');
            this.invalidFormula('cylinderVolume');
        } else {
            this.radiusInput.setError('');
            this.updateVolume();
        }
    }

    validateHeight() {
        const value = this.heightInput.getValue();
        if (value !== null && value <= 0) {
            this.heightInput.setError('Height must be a positive number.');
            this.invalidFormula('cylinderVolume');
        } else if (value === null && this.heightInput.element.value !== "") {
            this.heightInput.setError('Height must be a valid number.');
            this.invalidFormula('cylinderVolume');
        } else {
            this.heightInput.setError('');
            this.updateVolume();
        }
    }

    validateWidth() {
        const value = this.widthInput.getValue();
        if (value !== null && value <= 0) {
            this.widthInput.setError('Width must be a positive number.');
            this.invalidFormula('rectangleArea');
        } else if (value === null && this.widthInput.element.value !== "") {
            this.widthInput.setError('Width must be a valid number.');
            this.invalidFormula('rectangleArea');
        } else {
            this.widthInput.setError('');
            this.updateArea();
        }
    }
    validateLength() {
        const value = this.lengthInput.getValue();
        if (value !== null && value <= 0) {
            this.lengthInput.setError('Length must be a positive number.');
            this.invalidFormula('rectangleArea');
        } else if (value === null && this.lengthInput.element.value !== "") {
            this.lengthInput.setError('Length must be a valid number.');
            this.invalidFormula('rectangleArea');
        } else {
            this.lengthInput.setError('');
            this.updateArea();
        }
    }
}
const app = new Application();
app.feeInput.element.addEventListener('input', app.updateCalculation);
app.countInput.element.addEventListener('input', app.updateCalculation);
app.discountInput.element.addEventListener('input', app.updateCalculation);
app.radiusInput.element.addEventListener('input', app.updateCalculation);
app.heightInput.element.addEventListener('input', app.updateCalculation);
app.widthInput.element.addEventListener('input', app.updateCalculation);
app.lengthInput.element.addEventListener('input', app.updateCalculation);
