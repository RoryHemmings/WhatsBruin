
function setWithExpiry(key, value, ttl) { //key = user. 
	const now = new Date()

	// `item` is an object which contains the original value
	// as well as the time when it's supposed to expire
	const userStruct = {
		token: value,
		expiry: now.getTime() + ttl,
	}
	localStorage.setItem(key, JSON.stringify(userStruct))
}

function getWithExpiry(key) {
	const itemStr = localStorage.getItem(key)
	// if the item doesn't exist, return null
	if (!itemStr) {
		return null
	}
	const userStruct = JSON.parse(itemStr)
	const now = new Date()
	// compare the expiry time of the item with the current time
	if (now.getTime() > userStruct.expiry) {
		// If the item is expired, delete the item from storage
		// and return null
		localStorage.removeItem(key)
		return null
	}
	return userStruct.token
}

export {getWithExpiry, setWithExpiry}