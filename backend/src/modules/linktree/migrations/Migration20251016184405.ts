import { Migration } from '@mikro-orm/migrations';

export class Migration20251016184405 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "linkrow" ("id" text not null, "text" text not null, "href" text not null, "description" text not null, "order" integer not null, "active" boolean not null, "category" text not null, "tags" text[] null, "photo" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "linkrow_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_linkrow_deleted_at" ON "linkrow" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "linkrow" cascade;`);
  }

}
