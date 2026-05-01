import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create Admin user
  const adminPassword = await bcrypt.hash('admin123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@taskflow.com' },
    update: {},
    create: {
      email: 'admin@taskflow.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log(`✅ Admin user: ${admin.email} / password: admin123456`);

  // Create Member user
  const memberPassword = await bcrypt.hash('member123456', 12);
  const member = await prisma.user.upsert({
    where: { email: 'member@taskflow.com' },
    update: {},
    create: {
      email: 'member@taskflow.com',
      passwordHash: memberPassword,
      name: 'Jane Member',
      role: 'MEMBER',
    },
  });
  console.log(`✅ Member user: ${member.email} / password: member123456`);

  // Create a sample project
  const existing = await prisma.project.findFirst({
    where: { name: 'Website Redesign', createdBy: admin.id },
  });

  if (!existing) {
    const project = await prisma.project.create({
      data: {
        name: 'Website Redesign',
        description: 'Redesign the company website with a modern look and feel.',
        createdBy: admin.id,
        members: {
          create: [
            { userId: admin.id, role: 'ADMIN' },
            { userId: member.id, role: 'MEMBER' },
          ],
        },
      },
    });
    console.log(`✅ Project created: ${project.name}`);

    // Create sample tasks
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await prisma.task.createMany({
      data: [
        {
          title: 'Design new homepage mockup',
          description: 'Create wireframes and high-fidelity mockups for the new homepage.',
          status: 'IN_PROGRESS',
          dueDate: nextWeek,
          projectId: project.id,
          assigneeId: member.id,
        },
        {
          title: 'Set up CI/CD pipeline',
          description: 'Configure GitHub Actions for automated testing and deployment.',
          status: 'TODO',
          dueDate: nextWeek,
          projectId: project.id,
          assigneeId: admin.id,
        },
        {
          title: 'Write API documentation',
          description: 'Document all REST API endpoints using OpenAPI/Swagger.',
          status: 'TODO',
          dueDate: tomorrow,
          projectId: project.id,
          assigneeId: member.id,
        },
        {
          title: 'Fix mobile navigation bug',
          description: 'The hamburger menu does not close after selecting a link on iOS.',
          status: 'BLOCKED',
          dueDate: yesterday,
          projectId: project.id,
          assigneeId: member.id,
        },
        {
          title: 'Update color palette',
          description: 'Apply the new brand colors across all components.',
          status: 'COMPLETED',
          projectId: project.id,
          assigneeId: admin.id,
        },
        {
          title: 'Performance audit',
          description: 'Run Lighthouse audit and fix issues to achieve 90+ score.',
          status: 'TODO',
          dueDate: nextWeek,
          projectId: project.id,
        },
      ],
    });
    console.log('✅ Sample tasks created');

    // Create a second project
    const project2 = await prisma.project.create({
      data: {
        name: 'Mobile App v2.0',
        description: 'Build the next version of the mobile app with new features.',
        createdBy: admin.id,
        members: {
          create: [
            { userId: admin.id, role: 'ADMIN' },
          ],
        },
      },
    });

    await prisma.task.createMany({
      data: [
        {
          title: 'User authentication flow',
          description: 'Implement biometric login and social sign-in.',
          status: 'IN_PROGRESS',
          dueDate: nextWeek,
          projectId: project2.id,
          assigneeId: admin.id,
        },
        {
          title: 'Push notification system',
          description: 'Integrate Firebase Cloud Messaging for push notifications.',
          status: 'TODO',
          dueDate: nextWeek,
          projectId: project2.id,
        },
        {
          title: 'Offline mode support',
          description: 'Cache data locally so the app works without internet.',
          status: 'TODO',
          projectId: project2.id,
        },
      ],
    });
    console.log(`✅ Project created: ${project2.name}`);
  } else {
    console.log('ℹ️  Sample projects already exist, skipping...');
  }

  console.log('\n🎉 Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  Admin login:  admin@taskflow.com  /  admin123456');
  console.log('  Member login: member@taskflow.com /  member123456');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
