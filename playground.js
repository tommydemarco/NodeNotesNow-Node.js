require('./src/db/mongoose')
const User = require('./src/models/user')
// const { update } = require('./src/models/user')

const updateAndCount = async (id, name) => {
    const update = await User.findByIdAndUpdate(id, { name })
    const count = await User.countDocuments( {name} )
    return count
}

updateAndCount('5f5b915bc64d6537a4185c7d', "Simona").then((count) => {
    console.log(count)
}).catch((e) => {
    console.log("Error", e)
})