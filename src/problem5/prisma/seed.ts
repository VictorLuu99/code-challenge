import { PrismaClient, TaskStatus, TaskPriority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.task.createMany({
    data: [
      { title: 'Write project README', status: TaskStatus.done, priority: TaskPriority.high },
      { title: 'Set up CI', status: TaskStatus.in_progress, priority: TaskPriority.medium },
      {
        title: 'Refactor auth module',
        status: TaskStatus.todo,
        priority: TaskPriority.high,
        dueDate: new Date(Date.now() + 7 * 86400000),
      },
      { title: 'Update dependencies', status: TaskStatus.todo, priority: TaskPriority.low },
      {
        title: 'Investigate flaky test',
        description: 'task.controller.test occasionally times out',
        status: TaskStatus.todo,
        priority: TaskPriority.medium,
      },
    ],
  });
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
