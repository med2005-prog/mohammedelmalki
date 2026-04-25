import Post from "@/models/Post";
import Notification from "@/models/Notification";




export async function findMatchesAndNotify(postId: string) {
  try {
    const post = await Post.findById(postId);
    if (!post) return;

    const matchType = post.type === "lost" ? "found" : "lost";
    const searchString = `${post.title} ${post.description}`.replace(/[^\w\s]/gi, '');

    const matches = await Post.find({
      _id: { $ne: post._id },
      type: matchType,
      city: post.city,
      category: post.category,
      $text: { $search: searchString }
    })
    .sort({ score: { $meta: "textScore" } })
    .limit(5);

    for (const match of matches) {
      // Notify the owner of the existing post about the new match
      await Notification.create({
        recipient: match.author,
        sender: post.author,
        type: "match",
        title: "Potential Match Found! 🔍",
        message: `We found a new post that might match your "${match.title}": "${post.title}". Check it out now!`,
        link: `/posts/${post._id}`
      });

      // Also notify the author of the new post
      await Notification.create({
        recipient: post.author,
        sender: match.author,
        type: "match",
        title: "Potential Match Found! 🔍",
        message: `Your new post matches an existing report: "${match.title}". Check it out now!`,
        link: `/posts/${match._id}`
      });
    }

    return matches;
  } catch (error) {
    console.error("Matching error:", error);
  }
}
