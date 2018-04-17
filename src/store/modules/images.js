// 图片上传
const images = {
    // 负责存储整个应用的状态数据
	state: {
	    // 获取单图片显示路径
		getImageUrl: '',
		// 获取单图片上传的ID
		getImageId: '',
		// 获取多图片显示路径
		getImageUrlArr: [],
		// 获取多图片上传的ID
		getImageIdArr: [],
    },
    // 计算属性
	getters: {
        getImageUrl: state => state.getImageUrl,
        getImageId: state => state.getImageId,
        getImageUrlArr: state => state.getImageUrlArr,
        getImageIdArr: state => state.getImageIdArr,
    },
    // 用来处理数据的函数，只能同步操作
	mutations: {
		SET_IMAGE_URL: (state, getImageUrl) => {
		  state.getImageUrl = getImageUrl;
		},
		SET_IMAGE_ID: (state, getImageId) => {
		  state.getImageId = getImageId;
		},
		SET_IMAGE_URL_ARR: (state, getImageUrlArr) => {
		  state.getImageUrlArr = getImageUrlArr;
		},
		SET_IMAGE_ID_ARR: (state, getImageIdArr) => {
		  state.getImageIdArr = getImageIdArr;
		},
	},
}

export default images;
