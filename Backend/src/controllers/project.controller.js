const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const createProject = async (req,res)=>
{
    try{
        const {title,description,techStack,category,githubLink,liveDemo,tags} = req.body;
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

        res.status(201).json({
            project,
            message: 'Project created successfully'
        });
    } catch (err) {
        console.error('Project creation error:', err);
        return res.status(500).json({ message: 'Something went wrong while trying to create project' });
    }
}

const getProjects = async (req,res)=>
{
    try{
        const projects = await prisma.project.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({ projects, message: 'Projects fetched successfully' });
    } catch (err) {
        console.error('Projects fetching error:', err);
        return res.status(500).json({ 
            message: err.message || 'Something went wrong while trying to fetch projects',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

const getProjectById = async (req,res)=>
{
    try
    {
        const {id} = req.params;
        const project = await prisma.project.findUnique({where:{id: parseInt(id)}});
        
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        
        res.status(200).json({ project, message: 'Project fetched successfully' });
    }
    catch (err)
    {
        console.error('Project fetching error:', err);
        return res.status(500).json({ 
            message: err.message || 'Something went wrong while trying to fetch project',
            error: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
    }
}

const updateProject = async (req,res)=>
{
    try{
        const {id} = req.params;
        const {title,description,techStack,category,githubLink,liveDemo,tags} = req.body;
        const project = await prisma.project.update({
            where:{id: parseInt(id)},
            data:{title,description,techStack,category,githubLink,liveDemo,tags}
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

const deleteProject = async (req,res)=>
{
    try
    {
        const {id} = req.params;
        const project = await prisma.project.delete({where:{id: parseInt(id)}});
        res.status(200).json({ project, message: 'Project deleted successfully' });
    }
    catch (err)
    {
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

module.exports={createProject,getProjects,getProjectById,updateProject,deleteProject}