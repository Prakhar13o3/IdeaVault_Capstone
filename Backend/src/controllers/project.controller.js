const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createProject = async (req, res) => {
    try {
        const { title, description, techStack, category, githubLink, liveDemo, tags } = req.body;
        const userId = req.userId;

        const project = await prisma.project.create({
            data: {
                title,
                description,
                techStack,
                category,
                githubLink,
                liveDemo,
                tags,
                userId
            }
        });

        // Attach ownerName for frontend convenience
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const projectWithOwner = { ...project, ownerName: user ? user.username : 'Unknown' };

        res.status(201).json({
            project: projectWithOwner,
            message: 'Project created successfully'
        });
    } catch (err) {
        console.error('Project creation error:', err);
        return res.status(500).json({ message: 'Something went wrong while trying to create project' });
    }
}

const getProjects = async (req, res) => {
    try {
        // Parse query parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const category = req.query.category; // e.g., "mobile" or "web"

        // Build where clause for filtering
        const where = {};
        if (category) {
            where.category = {
                contains: category,
                mode: 'insensitive' // case-insensitive search
            };
        }

        // Get total count for pagination metadata
        const totalProjects = await prisma.project.count({ where });

        // Fetch paginated projects
        const projects = await prisma.project.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            skip: (page - 1) * limit,
            take: limit
        });

        // Attach owner (username) to each project for frontend display
        const projectsWithOwner = await Promise.all(
            projects.map(async (p) => {
                const user = await prisma.user.findUnique({ where: { id: p.userId } });
                return { ...p, ownerName: user ? user.username : 'Unknown' };
            })
        );

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalProjects / limit);
        const hasMore = page < totalPages;

        res.status(200).json({
            projects: projectsWithOwner,
            pagination: {
                totalProjects,
                totalPages,
                currentPage: page,
                hasMore,
                limit
            },
            message: 'Projects fetched successfully'
        });
    } catch (err) {
        console.error('Projects fetching error:', err);
        return res.status(500).json({
            message: err.message || 'Something went wrong while trying to fetch projects',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.findUnique({ where: { id } });
        if (project) {
            const user = await prisma.user.findUnique({ where: { id: project.userId } });
            project.ownerName = user ? user.username : 'Unknown';
        }

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({ project, message: 'Project fetched successfully' });
    }
    catch (err) {
        console.error('Project fetching error:', err);
        return res.status(500).json({
            message: err.message || 'Something went wrong while trying to fetch project',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, techStack, category, githubLink, liveDemo, tags } = req.body;
        const project = await prisma.project.update({
            where: { id },
            data: { title, description, techStack, category, githubLink, liveDemo, tags }
        });
        res.status(200).json({ project, message: 'Project updated successfully' });
    } catch (err) {
        console.error('Project updating error:', err);
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Project not found' });
        }
        return res.status(500).json({
            message: err.message || 'Something went wrong while trying to update project',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma.project.delete({ where: { id } });
        res.status(200).json({ project, message: 'Project deleted successfully' });
    }
    catch (err) {
        console.error('Project deleting error:', err);
        if (err.code === 'P2025') {
            return res.status(404).json({ message: 'Project not found' });
        }
        return res.status(500).json({
            message: err.message || 'Something went wrong while trying to delete project',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

module.exports = { createProject, getProjects, getProjectById, updateProject, deleteProject }