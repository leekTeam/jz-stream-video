const BASE_URL = 'http://127.0.0.1:3006';

const http = {};
http.post = ({ url, data }) => {
	return new Promise((resolve,reject)=>{
		uni.request({
			url: `${BASE_URL}${url}`,
			data,
			method: 'POST',
			success:(res) =>{
				resolve(res)
			},
			fail:(err)=>{
				reject(err)
			}
		})
	})
}

export default http;
