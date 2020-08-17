const db = require('../utils/db');

module.exports = {
    allBank: () => db.load(`select id, name from partnerbank`), 
    
    getAllHistory: async () =>{
        const rows = await db.load(`select partnerbank.name, partner_transfer_history.money_amount, partner_transfer_history.transfer_time 
                                        from partnerbank join partner_transfer_history on partnerbank.id = partner_transfer_history.partnerId 
                                            order by transfer_time DESC`);
        
        return rows;
    },

    getHistoryByPartnerId: id =>{
        if(id == 0){
            return db.load(`select partnerbank.name, partner_transfer_history.money_amount, partner_transfer_history.transfer_time 
                                from partnerbank join partner_transfer_history on partnerbank.id = partner_transfer_history.partnerId 
                                    order by transfer_time DESC`);;
        }
        return db.load(`select partnerbank.name, partner_transfer_history.money_amount, partner_transfer_history.transfer_time 
                            from partnerbank join partner_transfer_history on partnerbank.id = partner_transfer_history.partnerId where partnerbank.id = ${id} 
                                order by transfer_time DESC`);
    },

    getFilteredDate: async(startDate, endDate) => {
        const rows = await db.load(`select partnerbank.name, partner_transfer_history.money_amount, partner_transfer_history.transfer_time 
        from partnerbank join partner_transfer_history on partnerbank.id = partner_transfer_history.partnerId WHERE cast(transfer_time as date) BETWEEN '${startDate}' AND '${endDate}'`)
        return rows
    }
}