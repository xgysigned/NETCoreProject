using Z.Blazor.Diagrams.Core.Models;
using Z.Blazor.Diagrams.Core.Geometry;

namespace Models
{
    public class CustomNodeModel : NodeModel
    {
        public CustomNodeModel(Point position) : base(position)
        {
        }

        public string NodeType { get; set; } = "default";
        public AiNodeConfig? AiConfig { get; set; }
    }

    public class AiNodeConfig
    {
        public string NodeName { get; set; } = "";
        public string Model { get; set; } = "gpt-3.5-turbo";
        public string SystemPrompt { get; set; } = "";
        public double Temperature { get; set; } = 0.7;
        public int MaxTokens { get; set; } = 1000;
    }
}