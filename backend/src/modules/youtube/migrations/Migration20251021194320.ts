import { Migration } from '@mikro-orm/migrations';

export class Migration20251021194320 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "video" ("id" text not null, "videoid" text not null, "type" text not null, "title" text not null, "thumbnail" text not null, "order" integer not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "video_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_video_deleted_at" ON "video" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "video" cascade;`);
  }

}
