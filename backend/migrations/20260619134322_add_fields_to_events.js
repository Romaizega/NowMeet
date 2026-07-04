exports.up = function(knex) {
  return knex.schema.alterTable('events', function (table){
    table.string('city').nullable()
    table.string('country').nullable()
    table.string('cover_image').nullable()
    table.string('place_id').nullable()
  })
  
};

exports.down = function(knex) {
  return knex.schema.alterTable('events', (table)=> {
    table.dropColumn('city')
    table.dropColumn('country')
    table.dropColumn('cover_image')
    table.dropColumn('place_id')
  })
};
