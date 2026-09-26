import { useQuery } from '@tanstack/react-query';
import { fetchGitHubRepo } from '../services/githubService';
import { Project, GitHubRepoData } from '../types';

export function useFeaturedRepos(projects: Project[]) {
  const repoProjects = projects.filter(p => Boolean(p.repoName));

  const query = useQuery({
    queryKey: [
      'github',
      'featured',
      repoProjects
        .map(p => p.repoName)
        .sort()
        .join(','),
    ],
    queryFn: async () => {
      const results = await Promise.allSettled(
        repoProjects.map(p => fetchGitHubRepo('foxminchan', p.repoName!))
      );

      const repoMap: Record<string, GitHubRepoData> = {};
      results.forEach((res, index) => {
        const repoName = repoProjects[index].repoName;
        if (res.status === 'fulfilled' && repoName) {
          repoMap[repoName] = res.value;
        }
      });

      return repoMap;
    },
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false,
  });

  const featuredData = query.data ?? {};

  const totalStars = projects.reduce((total, project) => {
    const liveStars = project.repoName ? featuredData[project.repoName]?.starsCount : undefined;
    return total + (liveStars ?? Number.parseInt(project.stars, 10));
  }, 0);

  const refetch = async () => {
    await Promise.allSettled(
      repoProjects.map(p => fetchGitHubRepo('foxminchan', p.repoName!, true))
    );
    await query.refetch();
  };

  return {
    featuredData,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch,
    totalStars,
  };
}
