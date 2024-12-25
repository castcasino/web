/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'

/* Import blockchain clients. */
import baseClient from '../clients/base.js'
import degenClient from '../clients/degen.js'
import ethClient from '../clients/eth.js'

/* Import contract ABI. */
import castPokerAbi from '../abi/CastPoker.js'

/* Initialize databases. */
const pokerTablesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/poker_tables`)
const systemDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/system`)

/* Initialize constants. */
const CAST_POKER_ADDRESS = '0x3Dabb4d559C176ee7A149222404Af0deB7f8e889'

export default async (_idxCommunity) => {
// console.log('ADDING NEW TABLE', _idxCommunity)

    /* Initialize locals. */
    let seated
    let tableid
    let tableInfo

    tableid = _idxCommunity.height

    seated = []

    const blk = await systemDb
        .get('blk_table_created')
        .catch(err => console.error(err))
console.log('BLOCK CREATED', blk)

    if (typeof blk === 'undefined') {
        throw new Error('ERROR: System database failed!')
    }

    const tableLogs = await baseClient.getContractEvents({
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        eventName: 'TableCreated',
        fromBlock: BigInt(blk.height),
        // toBlock: BigInt(currentBlkHeight),
    }).catch(err => console.error(err))
console.log('TABLE LOGS', tableLogs)

    tableInfo = await baseClient.readContract({
        address: CAST_POKER_ADDRESS,
        abi: castPokerAbi,
        functionName: 'getTable',
        args: [tableid]
    }).catch(err => console.error(err))
// console.log('TABLE INFO (raw)', tableInfo)

    // tableInfo = {
    //     state: tableInfo[0],
    //     token: tableInfo[1],
    //     host: tableInfo[2],
    //     seed: tableInfo[3].toString(),
    //     buyin: tableInfo[4].toString(),
    //     tts: tableInfo[5].toString(),
    //     pot: tableInfo[6].toString(),
    //     paid: tableInfo[7].toString(),
    //     seats: tableInfo[8],
    //     fomo: tableInfo[9],
    //     theme: tableInfo[10],
    //     community: tableInfo[11],
    //     seated,
    // }
    tableInfo.seed = tableInfo.seed.toString()
    tableInfo.buyin = tableInfo.buyin.toString()
    tableInfo.tts = tableInfo.tts.toString()
    tableInfo.pot = tableInfo.pot.toString()
    tableInfo.paid = tableInfo.paid.toString()
console.log('ADD NEW TABLE INFO (sanitized)', tableInfo)

return

    pokerTablesDb.put({
        _id: tableid.toString(),
        ...tableInfo,
        createdAt: moment().unix(),
    })

    _idxCommunity.height = Number(tableid + 1)
    _idxCommunity.updatedAt = moment().unix()
// console.log('NEW IDX', idxTables)

    await systemDb
        .put(_idxCommunity)
        .catch(err => {
            if (err.message !== 'Document update conflict.') {
                console.error(err)
            }
        })
}
