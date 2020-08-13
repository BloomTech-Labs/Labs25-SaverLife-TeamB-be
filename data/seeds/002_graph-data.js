exports.seed = function (knex) {
    const data = {
          data:[
          ],    
          layout:
          {},
      }
          return knex('graph_data').insert(data);
  
    };