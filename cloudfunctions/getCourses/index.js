// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const {
        data
    } = await db.collection('courses').where({
       dateTime:db.command.eq(event.dateTime)
    }).get()
    return data;
}
