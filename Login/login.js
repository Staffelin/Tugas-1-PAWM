let container = document.getElementById('container')

toggle = () => {
	container.classList.toggle('sign-in')
	container.classList.toggle('sign-up')
}

setTimeout(() => {
	container.classList.add('sign-in')
}, 200)

class Login {
	constructor(form, fields){
		this.form = form;
		this.fields = fields;
		this.validateonSubmit();
	}

	validateonSubmit(){
		let self = this;
		this.form.addEventListener('submit', function(e){
			e.preventDefault();
 			self.fields.forEach(field => {
				self.validateFields(field);
			})
		})
	}
}

document.querySelector('form').addEventListener('submit', (event) => {
    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    if (!username || !password) {
        event.preventDefault();
        alert('Username and password are required!');
    }
});


const form = document.getElementById('form')
if(form){
	const fields = ["username", "password"];
	const validator = new Login(form, fields);
}