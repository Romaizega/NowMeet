exports.up = function(knex) {
  return knex.schema
   .createTable('users', function (table){
    table.increments('id').primary();
    table.string('username', 20).notNullable();
    table.string('email', 100).unique().notNullable();
    table.text('password_hash').notNullable();
    table.string('first_name', 50).nullable();
    table.string('last_name', 50).nullable();
    table.integer('verification_code').nullable();
    table.boolean('is_verified').defaultTo(false);
    table.timestamp('code_expires_at').nullable();
    table.date('date_of_birth').nullable();
    table.string('photo').nullable();
    table.text('about', 150).nullable();
    table.timestamps(true, true);
    table.string('role').defaultTo('user')
   })
};


exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users')
}
